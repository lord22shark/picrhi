/**
 * Pichri - Pipe Cropper to Hidden Input
 * @author Jaime Daniel Corrêa Mendes [a.k.a ~lordshark]
 * @since 2018-05-25 20:14
 * @dependencies: jQuery ^3.31, Bootstrap 4.1.1, Croppie ^2.6.2
 *
 * To Getúlio Dornelles Vargas: "I get out life to get into history!"
 *
 */

(function (__window) {

	// Checking for dependencies
	if ((!__window.jQuery) || (!(typeof $().modal == 'function')) || (!__window.Croppie)) {

		console.error('Fail to load!!! Pichri requires jQuery ^3.31, Bootstrap 4.1.1, Croppie ^2.6.2');

		return;

	}

	/**
	 *
	 */
	var Pichri = function Pichri (containerId, imageUrl, inputHiddenName, configuration) {

		this.configuration = configuration || Pichri.prototype.configuration;

		this.container = document.getElementById(containerId);

		if ((this.container) && (/[a-zA-Z0-9\-\_\[\]]{1,255}/.test(inputHiddenName))) {

			this.id = (Math.random()).toString(16).split('.')[1];

			this.modal = $(Pichri.prototype.templates.modal.replace(/\[\[ID\]\]/g, this.id));

			this.modal.appendTo(document.body);

			var inputs = $(Pichri.prototype.templates.inputs.replace(/\[\[ID\]\]/g, this.id).replace('[[NAME]]', inputHiddenName));

			inputs.appendTo(this.container);

			//var content = $(Pichri.prototype.templates.content.replace(/\[\[ID\]\]/g, this.id).replace('[[URL]]', imageUrl).replace('[[NAME]]', inputHiddenName));

			//	content.appendTo(this.container);

			var isBase64 = /^data:image\/[a-z]+;base64,/.test(imageUrl);

			var isURL = /(http(s)?\:)?\/?\//.test(imageUrl);

			var imageTemplate = Pichri.prototype.templates.image.toString();

			imageTemplate = imageTemplate.replace(/\[\[ID\]\]/g, this.id).replace(/\[\[URL\]\]/g, imageUrl || "");

			this.defaultImage = $(imageTemplate);

			if (!imageUrl) {

				var buttonTemplate = Pichri.prototype.templates.button.toString();

				var buttonConfiguration = this.configuration.button;

				buttonConfiguration.id = this.id;

				Object.keys(buttonConfiguration).forEach(function (key) {

					var regex = new RegExp('\\[\\[' + key.toUpperCase() + '\\]\\]', 'g');

					buttonTemplate = buttonTemplate.replace(regex, buttonConfiguration[key]);

				});

				this.button = $(buttonTemplate);

				this.button.appendTo(this.container);

				this.defaultImage.css('display', 'none');

			} else {

				if (!isBase64 && !isURL) {

					console.error('[PICHRI] imageUrl is not a valid format!');

					return null;

				}

			}

			this.defaultImage.appendTo(this.container);
		
			this.input = {};

			this.input.file = document.getElementById('pichriFile-' + this.id);

			this.input.hidden = document.getElementById('pichriInputHidden-' + this.id);

			if (isBase64) {

				this.input.hidden.value = imageUrl;

			}

			this.fsImage = document.getElementById('fsImage-' + this.id);

			this.closeButton = document.getElementById('btnFechar-' + this.id);

			// -------------

			/**
			 * Trigger input file click to open file dialog
			 */
			if (this.button) {

				this.button[0].onclick = function (event) {

					event.preventDefault();
					event.stopPropagation();

					this.input.file.click();

				}.bind(this);

			}

			/**
			 * Trigger input file click to open file dialog
			 */
			this.defaultImage[0].onclick = function (event) {

				event.preventDefault();
				event.stopPropagation();

				this.input.file.click();

			}.bind(this);

			/**
			 * Trigger the Cropper to produce result
			 * and close modal
			 */
			this.closeButton.onclick = function () {

				this.cropper.result({
					type: 'base64',
					size: {
						width: 200,
						height: 200
					}
				}).then(function (base64) {

					this.defaultImage[0].src = base64;

					this.input.hidden.value = this.defaultImage[0].src;

					this.cropper.destroy();

					this.input.file.value = null;

					$('#pichriModal-' + this.id).modal('hide');

					if (this.button) {

						this.button.css('display', 'none');

						this.defaultImage.css('display', 'inline-block');

					}

				}.bind(this));

			}.bind(this);

			/**
			 * Create an instance of Croppie when 
			 * modal is shown
			 */
			this.modal.on('shown.bs.modal', function () {

				this.cropper = new Croppie(this.fsImage, {
					enforceBoundary: false,
					viewport: {
						width: 200,
						height: 200,
						type: 'square'
					},
					boundary: {
						width: 640,
						height: 480
					}
				});

			}.bind(this));

			/**
			 *
			 */
			this.input.file.onchange = function (event) {

				var files = event.target.files;

				if (files.length === 1) {

					var reader = new FileReader();

					/**
					 *
					 */
					reader.onloadend = function () {

						var image = new Image();

						/**
						 *
						 */
						image.onload = function () {

							if ((image.width === 100) && (image.height === 100)) {

								this.defaultImage[0].src = image.src;

								this.input.hidden.value = image.src;

								if (this.button) {

									this.button.css('display', 'none');

									this.defaultImage.css('display', 'inline-block');

								}

							} else {

								this.fsImage.src = image.src;

								$('#pichriModal-' + this.id).modal('show');

							}

						}.bind(this);

						image.src = reader.result;

					}.bind(this);

					reader.readAsDataURL(files[0]);

				} else {

					window.alert('Você precisa selecionar uma imagem.');

				}

			}.bind(this);

		} else {

			console.error('[PICHRI]', containerId + ' does not exist or ' + inputHiddenName + ' is not a valid name for input.');

			return null;

		}

	};

	/**
	 *
	 */
	Pichri.prototype.configuration = {
		button: {
			class: 'pipe-form-input-file-button',
			icon: 'fa fa-camera',
			label: 'LOCALIZAR IMAGEM'
		}
	};

	/**
	 * My unique ID
	 */
	Pichri.prototype.id = null;

	/**
	 * Element Container
	 */
	Pichri.prototype.container = null;

	/**
	 * Default Button and event trigger
	 */
	Pichri.prototype.button = null;

	/**
	 * URL or Result Image and event trigger
	 */
	Pichri.prototype.defaultImage = null;

	/**
	 * Holder for inputs file and hidden
	 */
	Pichri.prototype.input = {
		file: null,
		hidden: null
	};

	/**
	 * Bootstrap modal
	 */
	Pichri.prototype.modal = null;

	/**
	 * Image in Modal (filesystem)
	 */
	Pichri.prototype.fsImage = null;

	/**
	 * Cropper.JS itself
	 */
	Pichri.prototype.cropper = null;

	/**
	 * Modal Template
	 */
	Pichri.prototype.templates = {
		button: '<button id="button-[[ID]]" type="button" class="[[CLASS]]" title="[CLICK TO CROP]"><i class="[[ICON]]"></i><span>[[LABEL]]</span></button>',
		modal: '<div class="modal fade" id="pichriModal-[[ID]]" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true"><div class="modal-dialog" role="document" style="min-width: 700px; width: 700px !important; min-height: 480px; height: 480px;"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Editar Imagem</h5></div><div class="modal-body"><div class="img-container"><img id="fsImage-[[ID]]" alt="Picture"></div></div><div class="modal-footer"><button type="button" id="btnFechar-[[ID]]" class="btn btn-default">OK</button></div></div></div></div>',
		image: '<img id="defaultImage-[[ID]]" title="Selecionar" alt="[CLICK TO CROP]" src="[[URL]]" style="border-radius:6px; cursor: pointer; box-shadow: 0px 0px 10px #E3E3E3; width: 100px; height: 100px;" />',
		inputs: '<input type="file" id="pichriFile-[[ID]]" style="display: none;" accept="image/*" /><input type="hidden" id="pichriInputHidden-[[ID]]" name="[[NAME]]" />'
	};

	/**
	 *
	 */
	Pichri.prototype.toBlob = function (uri) {

		var binary = atob(url.split(',')[1]);

		var bytes = [];

		for (var b = 0; b < binary.length; b++) {

			bytes.push(binary.charCodeAt(i));

		}

		return new Blob([new Uint8Array(bytes)], {type: 'image/png'});

	};

	__window.Pichri = Pichri;

})(window);
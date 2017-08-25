/**
 * Pichri - Pipe Cropper to Hidden Input
 * @author Jaime Daniel Corrêa Mendes [a.k.a ~lordshark]
 * @since 2017-08-24 21:45
 * @dependencies: jQuery ^1.11, Bootstrap 2 | 3, Cropper.JS ^v1.0.0-rc.3
 *
 * To Getúlio Dornelles Vargas: "I get out life to get into history!"
 *
 */

(function (__window) {

	// Checking for dependencies
	if ((!__window.jQuery) || (!(typeof $().modal == 'function')) || (!__window.Cropper)) {

		console.error('Fail to load!!! Pichri requires jQuery ^1.11, Bootstrap 2 | 3, Cropper.JS ^v1.0.0-rc.3');

		return;

	}

	/**
	 *
	 */
	var Pichri = function Pichri (containerId, imageUrl, inputHiddenName) {

		this.container = document.getElementById(containerId);

		if (this.container) {

			if (/(http(s)?\:)?\/\//.test(imageUrl)) {

				if (/[a-zA-Z0-9\-\_\[\]]{1,255}/.test(inputHiddenName)) {

					this.id = (Math.random()).toString(16).split('.')[1];

					this.modal = $(Pichri.prototype.templates.modal.replace(/\[\[ID\]\]/g, this.id));

					this.modal.appendTo(document.body);

					var content = $(Pichri.prototype.templates.content.replace(/\[\[ID\]\]/g, this.id).replace('[[URL]]', imageUrl).replace('[[NAME]]', inputHiddenName));

					content.appendTo(this.container);

					this.defaultImage = document.getElementById('defaultImage-' + this.id);

					this.input = {};

					this.input.file = document.getElementById('pichriFile-' + this.id);

					this.input.hidden = document.getElementById('pichriInputHidden-' + this.id);

					this.fsImage = document.getElementById('fsImage-' + this.id);

					// -------------

					/**
					 *
					 */
					this.defaultImage.onclick = function () {

						this.input.file.click();

					}.bind(this);

					/**
					 *
					 */
					this.modal.on('shown.bs.modal', function () {

						this.cropper = new Cropper(this.fsImage, {
							aspectRatio: 1,
							viewMode: 1,
							zoom: 1,
							ready: function () {

								var canvas = this.cropper.getCanvasData();

								if ((canvas.naturalWidth === 100) && (canvas.naturalHeight === 100)) {

									this.cropper.setCropBoxData({
										left: 0,
										top: 0,
										width: 100,
										height: 100
									});

								}

							}.bind(this)

						});

					}.bind(this)).on('hidden.bs.modal', function () {

						var croppedCanvas = this.cropper.getCroppedCanvas({
							width: 100,
							height: 100
						});

						this.defaultImage.src = croppedCanvas.toDataURL();

						this.input.hidden.value = this.defaultImage.src;

						this.cropper.destroy();

						this.input.file.value = null;

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

										this.defaultImage.src = image.src;

										this.input.hidden.value = image.src;

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

					// -------------

				} else {

					console.error('[PICHRI]', inputHiddenName + ' is not a valid name for input.');

					return null;

				}

			} else {

				console.error('[PICHRI]', imageUrl + ' is not a valid URL.');

				return null;

			}

		} else {

			console.error('[PICHRI]', containerId + ' does not exist.');

			return null;

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
	 * Default Image and event firer
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
		modal: '<div class="modal fade" id="pichriModal-[[ID]]" role="dialog" aria-labelledby="modalLabel" tabindex="-1"><div class="modal-dialog" role="document" style="min-width: 640px; width: 640px; min-height: 480px; height: 480px;"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Editar Imagem</h5></div><div class="modal-body"><div class="img-container"><img id="fsImage-[[ID]]" alt="Picture"></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button></div></div></div></div></div>',
		content: '<img id="defaultImage-[[ID]]" title="Selecionar" alt="[CLICK TO CROP]" src="[[URL]]" style="border-radius:6px; cursor: pointer; box-shadow: 0px 0px 10px #505050;"><input type="file" id="pichriFile-[[ID]]" style="display: none;" accept="image/*" /><input type="hidden" id="pichriInputHidden-[[ID]]" name="[[NAME]]" />'
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
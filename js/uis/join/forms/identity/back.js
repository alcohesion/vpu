export default class IdentityBack extends HTMLElement {
  constructor() {
    super();
    this.api = this.getAttribute('api');
    this.submit = this.getAttribute('submit');
    this.width = 320;
    this.height = 0;
    this.streaming = false;
    this.currentFacingMode = 'user';
    this.videoDevices = [];
    this.render();

    // select app container: component containing the form
    this.app = this.getRootNode().host;
  }

  async render() {
    this.innerHTML = this.getTemplate();
    await this.setupCamera();
    this.setupEventListeners();
    this.submitForm(this.querySelector('form'));
    this.handleBack(this.querySelector('form'));
  }

  handleBack = form => {
    const prevButton = form.querySelector('.button.prev');
    prevButton.addEventListener('click', e => {
      e.preventDefault();
      this.app.navigate({ kind: 'identity', no: 3 });
    });
  }

  submitForm = form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const submitButton = form.querySelector('.button.next');

      // add loading state & disable button
      submitButton.innerHTML = this.getLoader()
      submitButton.disabled = true;

      const upload = await this.uploadPicture(form);

      if (upload.uploaded) {
        // set values to app
        this.app.setIdentityData({ back: upload.url });

        // submit identity data
        const response = await this.submitIdentity(this.app.getIdentityData());

        // check if identity data was submitted successfully
        if (response.success) {
          // navigate to next form
          this.app.navigate({ kind: 'identity', no: 5 , status: response.user.stage.status, name: response.user.name, updated_at: response.user.updated_at });
        }
      } else {
        // remove loading state & enable button
        submitButton.innerHTML = this.getButtonNext();
        submitButton.disabled = false;
      }
    });
  }

  submitIdentity = async data => {
    const form = this.querySelector('form.fields');

    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    try {
      const response = await fetch(this.submit, options);

      const result = await response.json();

      // check !success response
      if(!result.success) {
        this.addSeverMessage(form, result.message);
        return {
          success: false,
          user: null
        }
      }

      return {
        success: true,
        user: result.user
      }
    } catch (error) {
      console.error(error);
      // SHOW ERROR MESSAGE
      this.addSeverMessage(form, 'An error occurred while trying to upload your picture. Please try again later.');

      return {
        success: false,
        user: null
      }
    }

  }

  uploadPicture = async form => {
    // get the image data
    const file = this.imageFile;

    // check if file is selected
    if (!file) {
      this.addSeverMessage(form, 'Please take a picture of yourself', 'error');
      return {
        uploaded: false,
        url: null
      }
    }

    try {
      const { blob } = await this.resizeImage(file);

      const formData = new FormData();
      formData.append('file', blob, 'image.webp');

      const response = await this.fetchWithTimeout(this.api, {
        method: 'POST',
        body: formData
      })
      const data = await response.json();

      if (data.success) {
        return {
          url: data.url,
          uploaded: true
        }
      } else {
        this.addSeverMessage(form, data.message);
        return {
          url: null,
          uploaded: false
        }
      }
    } catch (error) {
      this.addSeverMessage(form, 'An error occurred while trying to upload your picture. Please try again later.');
      console.error(error);
      return {
        url: null,
        uploaded: false
      }
    }
  }

  // Function to resize image and crop to square
  resizeImage = async file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxSize = 300;
          canvas.width = maxSize;
          canvas.height = maxSize;
          const aspectRatio = img.width / img.height;
          let sourceX = 0;
          let sourceY = 0;
          let sourceWidth = img.width;
          let sourceHeight = img.height;
          if (aspectRatio > 1) {
            sourceX = (img.width - img.height) / 2;
            sourceWidth = img.height;
          } else {
            sourceY = (img.height - img.width) / 2;
            sourceHeight = img.width;
          }
          ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, maxSize, maxSize);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({ blob, width: maxSize, height: maxSize });
              } else {
                reject(new Error('Failed to create blob'));
              }
            },
            'image/webp',
            0.9
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  addSeverMessage = (form, message, type = 'error') => {
    const actions = form.querySelector('.buttons');
    actions.insertAdjacentHTML('beforebegin', this.serverMessage(message, type));

    setTimeout(() => {
      const message = form.querySelector('.server-message');
      if (message) message.remove();
    }, 5000);
  }

  serverMessage = (message, type = 'error') => {
    return /*html*/`
      <div class="server-message ${type}">
        <h4 class="title">${message}</h4>
      </div>
    `;
  }

  fetchWithTimeout = async (url, options = {}, timeout = 9500) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw new Error(`Network error: ${error.message}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  setupEventListeners() {
    const captureButton = this.querySelector('#capture-button');
    const retakeButton = this.querySelector('#retake-button');
    const switchCameraButton = this.querySelector('#switch-camera-button');

    captureButton.addEventListener('click', () => this.takePicture());
    retakeButton.addEventListener('click', () => this.startCamera());
    switchCameraButton.addEventListener('click', () => this.switchCamera());
  }

  async setupCamera() {
    const videoElement = this.querySelector('video');
    this.canvas = this.querySelector('canvas');
    this.photo = this.querySelector('#captured-image');

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (this.videoDevices.length > 1) {
        this.querySelector('#switch-camera-button').style.display = 'inline-block';
      }

      const stream = await this.getStream();
      videoElement.srcObject = stream;
      videoElement.play();
    } catch (error) {
      console.error('Error accessing camera:', error);
      this.querySelector('.image-preview').textContent = 'Error accessing camera. Please make sure you have given permission.';
    }

    videoElement.addEventListener('canplay', (ev) => {
      if (!this.streaming) {
        this.height = videoElement.videoHeight / (videoElement.videoWidth / this.width);

        if (isNaN(this.height)) {
          this.height = this.width / (4 / 3);
        }

        videoElement.setAttribute('width', this.width);
        videoElement.setAttribute('height', this.height);
        this.canvas.setAttribute('width', this.width);
        this.canvas.setAttribute('height', this.height);
        this.streaming = true;
      }
    }, false);
  }

  async getStream() {
    const constraints = {
      video: { facingMode: this.currentFacingMode },
      audio: false
    };
    return await navigator.mediaDevices.getUserMedia(constraints);
  }

  switchCamera = async () => {
    this.rotateSVG();
    this.currentFacingMode = this.currentFacingMode === 'user' ? 'environment' : 'user';
    const videoElement = this.querySelector('video');
    const stream = videoElement.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());

    try {
      const newStream = await this.getStream();
      videoElement.srcObject = newStream;
      videoElement.play();
    } catch (error) {
      console.error('Error switching camera:', error);
    }
  }

  rotateSVG = () => {
    const svg = this.querySelector('#switch-camera-button svg');
    const current = svg.style.transform;

    if (current === 'rotate(180deg)') {
      svg.style.transform = 'rotate(0deg)';
    } else {
      svg.style.transform = 'rotate(180deg)';
    }
  }

  takePicture() {
    const context = this.canvas.getContext('2d');
    const videoElement = this.querySelector('video');
    
    if (this.width && this.height) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      
      // Check if the video is ready
      if (videoElement.readyState >= videoElement.HAVE_CURRENT_DATA) {
        context.drawImage(videoElement, 0, 0, this.width, this.height);

        const imageDataUrl = this.canvas.toDataURL('image/png');
        this.photo.value = imageDataUrl;
        
        // Convert data URL to File object
        this.imageFile = this.dataURLtoFile(imageDataUrl, 'captured_image.png');
        
        this.querySelector('.image-preview').style.backgroundImage = `url(${imageDataUrl})`;
        videoElement.pause();
        videoElement.style.display = 'none';
        this.querySelector('#capture-button').style.display = 'none';
        this.querySelector('#retake-button').style.display = 'inline-block';
        this.querySelector('#switch-camera-button').style.display = 'none';

        // You can call the upload method here or trigger it with a separate button
        // this.uploadImage();
      } else {
        console.error('Video not ready. Please try again.');
        // Optionally, you could retry after a short delay
        setTimeout(() => this.takePicture(), 100);
      }
    } else {
      this.clearPhoto();
    }
  }

  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  clearPhoto() {
    const context = this.canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const imageDataUrl = this.canvas.toDataURL('image/png');
    this.photo.value = '';
    this.querySelector('.image-preview').style.backgroundImage = `url(${imageDataUrl})`;
  }

  async startCamera() {
    const videoElement = this.querySelector('video');
    const previewElement = this.querySelector('.image-preview');

    videoElement.style.display = 'block';

    try {
      const stream = await this.getStream();
      videoElement.srcObject = stream;
      videoElement.play();

      previewElement.style.backgroundImage = 'none';
      this.querySelector('#capture-button').style.display = 'inline-block';
      this.querySelector('#retake-button').style.display = 'none';
      if (this.videoDevices.length > 1) {
        this.querySelector('#switch-camera-button').style.display = 'inline-block';
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      previewElement.textContent = 'Error accessing camera. Please make sure you have given permission.';
    }
  }

  getTemplate() {
    return `
      ${this.getHeader()}
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody() {
    return /*html*/`
      <form class="fields picture">
        <div class="image-preview">
          <video id="video">Video stream not available.</video>
          <canvas id="canvas" style="display:none;"></canvas>
        </div>
        <div class="actions">
          <button type="button" id="switch-camera-button" class="action" style="display: none;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M15.1667 0.999756L15.7646 2.11753C16.1689 2.87322 16.371 3.25107 16.2374 3.41289C16.1037 3.57471 15.6635 3.44402 14.7831 3.18264C13.9029 2.92131 12.9684 2.78071 12 2.78071C6.75329 2.78071 2.5 6.90822 2.5 11.9998C2.5 13.6789 2.96262 15.2533 3.77093 16.6093M8.83333 22.9998L8.23536 21.882C7.83108 21.1263 7.62894 20.7484 7.7626 20.5866C7.89627 20.4248 8.33649 20.5555 9.21689 20.8169C10.0971 21.0782 11.0316 21.2188 12 21.2188C17.2467 21.2188 21.5 17.0913 21.5 11.9998C21.5 10.3206 21.0374 8.74623 20.2291 7.39023" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button type="button" id="capture-button" class="action">Take Photo</button>
          <button type="button" id="retake-button" class="action" style="display: none;">Retake Photo</button>
        </div>
        <input type="hidden" id="captured-image" name="captured-image" />
        ${this.getButtons()}
      </form>
    `;
  }

  getHeader = () => {
    return /* html */`
      <div class="content">
        <div class="top">
          <h4 class="title">Your identity document</h4>
          <p class="desc">
            Click on <strong><i>Take Photo</i></strong> to capture a <b>back</b> view of your identity document.
            <br>Make sure the document is clear and all details are visible. You can <strong><i>Retake Photo</i></strong> if it is not looking good.
            <br><span> Use mobile phone for better results.</span>
          </p>
        </div>
      </div>
    `;
  }

  getButtons = () => {
    return /*html*/`
      <div class="buttons">
        <button type="button" class="button prev">
          ${this.getButtonPrev()}
        </button>
        <button type="submit" class="button next">
          ${this.getButtonNext()}
        </button>
      </div>
    `
  }

  getButtonPrev = () => {
    return /*html*/`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
        <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span class="text">Back</span>
    `;
  }

  getButtonNext = () => {
    return /*html*/`
      <span class="text">Next</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
        <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }

  getLoader = () => {
    return /*html*/`
      <div id="loader" class="loader"></div>
    `;
  }

  getStyles() {
    return /* css */`
      <style>
        *,
        *:after,
        *:before {
          box-sizing: border-box !important;
          font-family: inherit;
          -webkit-box-sizing: border-box !important;
        }

        *:focus {
          outline: inherit !important;
        }

        *::-webkit-scrollbar {
          -webkit-appearance: none;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          padding: 0;
          margin: 0;
          font-family: inherit;
        }

        p,
        ul,
        ol {
          padding: 0;
          margin: 0;
        }

        a {
          text-decoration: none;
        }

        :host {
          font-size: 16px;
          display: flex;
          flex-flow: column;
          gap: 10px;
          padding: 0;
          width: 100%;
        }

        #loader.loader {
          width: 42px;
          aspect-ratio: 4;
          --c:#6e2d6e 90%,#0000;
          --c1:#d1a0d1 90%,#0000;
          --c2:#8a3d8a 90%,#0000;
          background: 
            radial-gradient(circle closest-side at left  8px top 50%,var(--c)),
            radial-gradient(circle closest-side                     ,var(--c1)),
            radial-gradient(circle closest-side at right 8px top 50%,var(--c2));
          background-size: 100% 100%;
          background-repeat: no-repeat;
          animation: l4 1s infinite alternate;
        }
        
        @keyframes l4 {
          to { width: 16px; aspect-ratio: 1 }
        }

        .server-message {
          display: flex;
          flex-flow: column;
          gap: 0px;
          padding: 10px;
          border-radius: 12px;
          border: var(--border);
        }

        .server-message.error {
          border: var(--error-border);
          color: var(--error-color);
        }

        .server-message.success {
          border: var(--success-border);
          color: var(--accent-color);
        }

        .server-message > h4.title {
          display: flex;
          align-items: center;
          color: inherit;
          font-size: 1.1rem;
          font-weight: 500;
          margin: 0;
          padding: 0 0 6px 0;
        }

        .server-message > p {
          padding: 0;
          margin: 0;
          color: inherit;
          font-size: 0.9rem;
        }

        .content {
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 0;
          margin: 10px 0;
          padding: 0;
        }

        .top {
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        .top > h4.title {
          display: flex;
          align-items: center;
          font-family: var(--font-main), sans-serif;
          color: var(--title-color);
          font-size: 1.3rem;
          font-weight: 500;
          margin: 0;
          padding: 0 0 6px 0;
        }

        .top > .desc {
          margin: 0;
          padding: 5px 0;
          text-align: center;
          color: var(--text-color);
          font-size: 0.9rem;
          font-family: var(--font-main), sans-serif;
        }

        .top > .desc strong {
          font-weight: 500;
        }

        .top > .desc span {
          font-size: 0.9rem;
          font-family: var(--font-read), sans-serif;
          font-style: italic;
        }

        form.fields {
          margin: 0 0 15px;
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        form.fields > .field {
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          gap: 20px;
        }

        form.fields.center > .field {
          align-items: center;
        }

        form.fields .field .input-group {
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          color: var(--text-color);
          gap: 5px;
          position: relative;
          transition: border-color 0.3s ease-in-out;
        }

        form.fields .field.bio .input-group {
          width: 100%;
        }
        
        form.fields .field .input-group > svg {
          position: absolute;
          right: 10px;
          top: 38px;
          width: 20px;
          height: 20px;
        }

        form.fields label {
          padding: 0 0 5px 0;
          color: var(--text-color);
        }

        form.fields .field.bio label {
          padding: 0 0 0 5px;
        }

        form.fields label {
          color: var(--label-color);
          font-size: 1.1rem;
          font-family: var(--font-main), sans-serif;
          transition: all 0.3s ease-in-out;
          pointer-events: none;
        }

        form.fields .actions {
          display: flex;
          align-items: center;
          justify-content: center;
          width: max-content;
          gap: 10px;
          margin: 0 0 0 2px;
        }

        form.fields .actions > .action {
          border: none;
          background: var(--gray-background);
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          flex-flow: row;
          align-items: center;
          text-transform: capitalize;
          justify-content: center;
          padding: 7px 15px 7px;
          min-width: 100px;
          width: max-content;
          position: relative;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
        }

        form.fields .actions > #switch-camera-button {
          background: var(--gray-background);
          border: none;
          width: 40px;
          max-width: 40px;
          min-width: 40px;
          height: 35px;
          border-radius: 10px;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-contents: center;
        }

        form.fields .actions > #switch-camera-button svg {
          width: 20px;
          height: 20px;
          transition: transform 0.3s ease-in-out;
        }

        form.fields .actions > .action:hover {
          color: var(--text-color);
        }

        form.fields .actions > .action.sent {
          border: var(--action-border);
          background: none;
          background-color: none;
          color: var(--gray-color);
          padding: 6px 15px 6px;
        }

        form.fields.picture > .image-preview {
          border: var(--input-border);
          position: relative;
          width: 325px;
          height: 200px;
          min-width: 325px;
          min-height: 200px;
          object-fit: cover;
          display: flex;
          align-items: center;
          overflow: hidden;
          justify-content: center;
          background-image: url(${this.getAttribute('profile-image')});
          background-repeat: no-repeat !important;
          background-position: 100%;
          background-size: cover;
          border-radius: 10px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          -ms-border-radius: 10px;
          -o-border-radius: 10px;
        }

        form.fields.picture > .image-preview p {
          color: var(--text-color);
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 500;
          text-align: center;
          font-size: 0.85rem;
          margin: 0;
          padding: 0;
        }

        form.fields.picture > .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: none;
          border-radius: 20px;
        }

        form.fields.picture > .image-preview input + label {
          display: inline-block;
          width: max-content;
          height: 30px;
          margin-bottom: 0;
          border-radius: 100%;
          background-color: #ffffff45;
          border: 1px solid transparent;
          box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
          cursor: pointer;
          position: absolute;
          right: calc(50% - 20px);
          top: calc(50% - 20px);
          transform: translateY(-50%);
          font-weight: normal;
        }

        form.fields.picture > .image-preview input {
          opacity: 0;
        }

        form.fields.picture > .image-preview label {
          position: absolute;
          width: 40px;
          height: 40px;
          min-width: 40px;
          min-height: 40px;
          top: calc(50% - 20px);
          padding: 7px 12px;
          z-index: 1;
          margin: 0;
          text-align: center;
          background: var(--accent-linear);
          color: var(--white-color);
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 500;
          border-radius: 50px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        form.fields.picture > .image-preview label svg {
          width: 20px;
          height: 20px;
        }
        
        .buttons {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin: 10px 0;
        }

        .buttons.disabled {
          display: none;
          visibility: hidden;
        }

        .buttons > .button {
          border: none;
          position: relative;
          background: var(--gray-background);
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          flex-flow: row;
          align-items: center;
          text-transform: capitalize;
          justify-content: center;
          padding: 7px 15px 7px;
          height: 35px;
          min-width: 90px;
          width: 90px;
          position: relative;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
        }

        .buttons > .button.prev {
          border: var(--action-border);
          background: none;
          background-color: none;
          color: var(--text-color);
          padding: 6px 15px 6px 13px;
        }

        .buttons > .button.next {
          color: var(--text-color);
          padding: 7px 13px 7px 15px;
        }

        .buttons > .button.next:hover {
          color: var(--text-color);
        }

        .buttons > .button svg {
          width: 18px;
          height: 18px;
          color: inherit;
          margin: 0 0 -2px 0;
        }

        .buttons > .button.next {
          color: var(--text-color);
          background: var(--gray-background);
        }

        .buttons > .button.prev.disabled,
        .buttons > .button.next.disabled {
          pointer-events: none;
          opacity: 0.5;
          cursor: not-allowed !important;
        }

        @media screen and (max-width:600px) {
          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          a,
          form.fields .buttons > .button,
          form.fields .actions > .action {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}
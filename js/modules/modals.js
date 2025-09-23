class Modal {
  constructor(selector) {
    this.modal = document.querySelector(selector);
    this.overlay = this.modal.querySelector('.modal-overlay');
    this.form = this.modal.querySelector('form');
    this.isOpen = false;

    // fechar no ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });
  }

  open() {
    this.modal.classList.remove('hidden');
    this.isOpen = true;
  }

  close() {
    this.modal.classList.add('hidden');
    this.isOpen = false;
    this.form.reset();
  }
}

export class CreateModal extends Modal {
  constructor(selector, handleSubmit) {
    super(selector);
    this.handleSubmit = handleSubmit;
    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
      this.close();
    });
  }
}

export class EditModal extends Modal {
  constructor(selector, handleSubmit) {
    super(selector);
    this.handleSubmit = handleSubmit;
    this.currentCourse = null;
    this.bindEvents();
  }

  open(course) {
    this.currentCourse = course;
    this.modal.classList.remove('hidden');
    this.isOpen = true;
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
      this.close();
    });
  }
}

export class ProgressModal extends Modal {
  constructor(selector, handleSubmit) {
    super(selector);
    this.handleSubmit = handleSubmit;
    this.currentCourse = null;
    this.bindEvents();
  }

  open(course) {
    this.currentCourse = course;
    this.modal.classList.remove('hidden');
    this.isOpen = true;
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
      this.close();
    });
  }
}
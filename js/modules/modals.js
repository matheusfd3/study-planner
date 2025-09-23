class Modal {
  constructor(selector) {
    this.modal = document.querySelector(selector);
    this.form = this.modal.querySelector('form');
    this.isOpen = false;

    // fechar no ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
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

export class CreateCourseModal extends Modal {
  constructor(selector, onSubmit) {
    super(selector);
    this.onSubmit = onSubmit;
    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit();
      this.close();
    });
  }
}

export class EditCourseModal extends Modal {
  constructor(selector, onSubmit) {
    super(selector);
    this.onSubmit = onSubmit;
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
      this.onSubmit();
      this.close();
    });
  }
}

export class ProgressModal extends Modal {
  constructor(selector, onSubmit) {
    super(selector);
    this.onSubmit = onSubmit;
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
      this.onSubmit();
      this.close();
    });
  }
}
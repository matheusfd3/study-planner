class Modal {
  constructor(selector) {
    this.selector = selector;
    this.isOpen = false;
    this.initialize();
    this.bindBaseEvents();
    this.afterInit(); // Gancho para subclasses
  }

  initialize() {
    this.modal = document.querySelector(this.selector);
    this.closeButton = this.modal.querySelector('.close-button');
    this.form = this.modal.querySelector('form');
  }

  bindBaseEvents() {
    // Fecha com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
    // Fecha ao clicar no overlay
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    // Fecha ao clicar no botão
    this.closeButton.addEventListener('click', () => this.close());
  }

  open(data = null) {
    this.modal.classList.add('show');
    document.body.classList.add('no-scroll');
    this.isOpen = true;
    this.onOpen(data); // Gancho para subclasses
  }

  close() {
    this.modal.classList.remove('show');
    document.body.classList.remove('no-scroll');
    this.isOpen = false;
    this.form.reset();
  }

  onOpen(data) {}
  afterInit() {}
}
export class CreateModal extends Modal {
  constructor(selector, handleSubmit) {
    super(selector);
    this.handleSubmit = handleSubmit;
  }

  afterInit() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
      this.close();
    });
  }

  onOpen(data) {
    setTimeout(() => {
      this.form.querySelector('input').focus();
      document.querySelectorAll('.checkbox-item').forEach((item) => {
        item.querySelector('input[type="checkbox"]').dispatchEvent(new Event('change'));
      });
    }, 100);
  }
}

export class EditModal extends Modal {
  constructor(selector, handleSubmit) {
    super(selector);
    this.handleSubmit = handleSubmit;
  }

  afterInit() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Ainda vou validar com os dados do formulário aqui
      this.handleSubmit(this.currentCourse);
      this.close();
    });
  }

  onOpen(course) {
    this.currentCourse = course;
    // Ainda vou preencher os campos do formulário aqui
  }
}

export class ProgressModal extends Modal {
  constructor(selector, handleSubmit) {
    super(selector);
    this.handleSubmit = handleSubmit;
  }

  afterInit() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Ainda vou validar com os dados do formulário aqui
      this.handleSubmit(this.currentCourse);
      this.close();
    });
  }

  onOpen(course) {
    this.currentCourse = course;
    // Ainda vou preencher os campos do formulário aqui
  }
}
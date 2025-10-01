import {
  validateCourseTitle,
  validateCourseDuration,
  validateTargetDate,
  validateDaysOffWeek,
} from './validations.js';

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
  constructor(selector, handleSubmit, notification) {
    super(selector);
    this.handleSubmit = handleSubmit;
    this.notification = notification;
  }

  afterInit() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      data['create-days-off'] = formData.getAll('create-days-off');

      const errors = [];

      const titleValidation = validateCourseTitle(data['create-title']);
      if (!titleValidation.isValid) errors.push(titleValidation.message);

      const durationValidation = validateCourseDuration(data['create-duration']);
      if (!durationValidation.isValid) errors.push(durationValidation.message);

      const dateValidation = validateTargetDate(data['create-target-date']);
      if (!dateValidation.isValid) errors.push(dateValidation.message);

      const daysOffValidation = validateDaysOffWeek(data['create-days-off']);
      if (!daysOffValidation.isValid) errors.push(daysOffValidation.message);

      if (errors.length > 0) {
        errors.forEach(err => this.notification.warning(err));
        return
      }

      const formattedData = {
        title: data['create-title'].trim(),
        totalDuration: data['create-duration'],
        targetDate: data['create-target-date'],
        daysOff: data['create-days-off'],
      };

      this.handleSubmit(formattedData);
      this.close();
    });
  }

  onOpen(data) {
    setTimeout(() => {
      this.modal.querySelector('.modal-content').scrollTo(0, 0);
      this.form.querySelector('input').focus();
      this.form.querySelectorAll('.checkbox-item').forEach((item) => {
        item.querySelector('input[type="checkbox"]').dispatchEvent(new Event('change'));
      });
    }, 100);
  }
}

export class EditModal extends Modal {
  constructor(selector, handleSubmit, notification) {
    super(selector);
    this.handleSubmit = handleSubmit;
    this.notification = notification;
  }

  afterInit() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      data['edit-days-off'] = formData.getAll('edit-days-off');

      const errors = [];

      this.currentCourse = {
        ...this.currentCourse,
        title: data['edit-title'].trim(),
        totalDuration: data['edit-duration'],
        targetDate: data['edit-target-date'],
        daysOff: data['edit-days-off'],
      }

      const titleValidation = validateCourseTitle(this.currentCourse.title);
      if (!titleValidation.isValid) errors.push(titleValidation.message);

      const durationValidation = validateCourseDuration(this.currentCourse.totalDuration);
      if (!durationValidation.isValid) errors.push(durationValidation.message);

      const dateValidation = validateTargetDate(this.currentCourse.targetDate);
      if (!dateValidation.isValid) errors.push(dateValidation.message);

      const daysOffValidation = validateDaysOffWeek(this.currentCourse.daysOff);
      if (!daysOffValidation.isValid) errors.push(daysOffValidation.message);

      if (errors.length > 0) {
        errors.forEach(err => this.notification.warning(err));
        return
      }

      this.handleSubmit(this.currentCourse);
      this.close();
    });
  }

  onOpen(course) {
    this.currentCourse = course;
    setTimeout(() => {
      this.modal.querySelector('.modal-content').scrollTo(0, 0);
      this.form.querySelector('input').focus();

      this.form.querySelector('#edit-course-title').value = this.currentCourse.title;
      this.form.querySelector('#edit-course-duration').value = this.currentCourse.totalDuration;
      this.form.querySelector('#edit-target-date').value = this.currentCourse.targetDate;
      this.form.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = this.currentCourse.daysOff.includes(checkbox.value);
      });

      this.form.querySelectorAll('.checkbox-item').forEach((item) => {
        item.querySelector('input[type="checkbox"]').dispatchEvent(new Event('change'));
      });
    }, 100);
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
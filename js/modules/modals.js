import {
  validateCourseTitle,
  validateCourseDuration,
  validateTargetDate,
  validateDaysOffWeek,
  validateProgressDate,
  validateProgressDuration
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
        return;
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
        return;
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
  constructor(selector, handleSubmit, notification) {
    super(selector);
    this.handleSubmit = handleSubmit;
    this.notification = notification;
  }

  afterInit() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit(this.currentCourse);
      this.close();
    });

    this.form.querySelector('.add-progress-button').addEventListener('click', () => this.addProgress());
  }

  onOpen(course) {
    this.currentCourse = JSON.parse(JSON.stringify(course));
    this.renderStudySessions();
    setTimeout(() => {
      this.modal.querySelector('.modal-content').scrollTo(0, 0);
      this.form.querySelector('input').focus();
    }, 100);
  }

  addProgress() {
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());

    const errors = [];

    const durationValidation = validateProgressDuration(data['progress-duration']);
    if (!durationValidation.isValid) errors.push(durationValidation.message);

    const dateValidation = validateProgressDate(data['progress-date']);
    if (!dateValidation.isValid) errors.push(dateValidation.message);

    if (errors.length > 0) {
      errors.forEach(err => this.notification.warning(err));
      return;
    }

    this.currentCourse.studySessions.push({
      date: data['progress-date'],
      hoursStudied: data['progress-duration'],
    });
    this.renderStudySessions();
    this.form.reset();
  }

  renderStudySessions() {
    const progressList = this.form.querySelector('.progress-list');
    progressList.innerHTML = '';

    if (this.currentCourse.studySessions.length === 0) {
      progressList.innerHTML = '<p class="no-progress">Nenhum progresso registrado ainda.</p>';
      return;
    }

    this.currentCourse.studySessions.forEach(session => {
      const item = document.createElement('div');

      item.classList.add('progress-item');
      item.innerHTML = `
        <div class="progress-info">
          <div class="progress-date">${session.date}</div>
          <div class="progress-time">${session.hoursStudied}</div>
        </div>
      `;

      const createRemoveButton = document.createElement('button');
      createRemoveButton.type = 'button';
      createRemoveButton.classList.add('remove-progress-button');
      createRemoveButton.textContent = 'Remover';
      createRemoveButton.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja remover este registro de progresso?')) {
          this.currentCourse.studySessions = this.currentCourse.studySessions.filter(s => s !== session);
          this.renderStudySessions();
        }
      });
      item.appendChild(createRemoveButton);
      progressList.appendChild(item);
    });
  }
}
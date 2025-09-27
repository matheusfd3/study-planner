import { APP_CONFIG } from './config.js';
import { MyStorageManager } from './modules/storage.js';
import { NotificationManager } from './modules/notifications.js';
import { CreateModal, EditModal, ProgressModal } from './modules/modals.js';
import { calculateCourseStats } from './modules/courseCalculations.js';

class StudyPlannerApp {
  constructor() {
    this.storage = new MyStorageManager(APP_CONFIG.STORAGE_KEY);
    this.notification = new NotificationManager();
    this.createModal = new CreateModal('#create-modal', this.handleCreateCourse.bind(this), this.notification);
    // this.editModal = new EditModal('#edit-course-modal', this.handleUpdateCourse.bind(this), this.notification);
    // this.progressModal = new ProgressModal('#progress-course-modal', this.handleUpdateProgress.bind(this), this.notification);
    this.initializeApp();
  }

  initializeApp() {
    this.bindEventListeners();
    this.loadCourseList();
  }

  bindEventListeners() {
    document.querySelector('#create-study-plan-button').addEventListener('click', () => {
      this.createModal.open();
    });

    document.querySelectorAll('input[type="text"][placeholder*="00:00:00"]').forEach(input => {
      input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
        if (value.length > 6) value = value.slice(0, 6);

        let masked = '';
        if (value.length > 0) masked = value.slice(0, 2);
        if (value.length > 2) masked += ':' + value.slice(2, 4);
        if (value.length > 4) masked += ':' + value.slice(4, 6);

        e.target.value = masked;
      });
    });

    document.querySelectorAll('.checkbox-item').forEach((item) => {
      const label = item.querySelector('label');
      const checkbox = item.querySelector('input[type="checkbox"]');

      item.addEventListener('click', function(e) {
        if (e.target.tagName.toLowerCase() === 'label') return;
        label.click();
      });

      checkbox.addEventListener('change', function() {
        item.classList.toggle('selected', checkbox.checked);
      });
    });
  }

  handleCreateCourse(courseData) {
    const newCourse = {
      ...courseData,
      id: crypto.randomUUID(),
      status: APP_CONFIG.COURSE_STATUS.ONGOING,
      studySessions: [],
    }
    this.storage.addCourse(newCourse);
    this.notification.success('Curso criado com sucesso!');
    this.loadCourseList();
  }

  handleToggleCourseStatus(course) {
    if (confirm(`Tem certeza que deseja ${course.status === APP_CONFIG.COURSE_STATUS.ONGOING ? 'concluir' : 'retomar'} o curso "${course.title}"?`)) {
      course.status = course.status === APP_CONFIG.COURSE_STATUS.ONGOING
        ? APP_CONFIG.COURSE_STATUS.COMPLETED
        : APP_CONFIG.COURSE_STATUS.ONGOING;

      this.storage.updateCourse(course);
      this.notification.success(`Curso ${course.status === APP_CONFIG.COURSE_STATUS.ONGOING ? 'reaberto' : 'finalizado'} com sucesso!`);
      this.loadCourseList();
    }
  }

  handleDeleteCourse(course) {
    if (confirm(`Tem certeza que deseja excluir o curso "${course.title}"?`)) {
      this.storage.deleteCourse(course.id);
      this.notification.success('Curso excluído com sucesso!');
      this.loadCourseList();
    }
  }

  loadCourseList() {
    const ongoingCourses = this.storage.getCoursesByStatus(APP_CONFIG.COURSE_STATUS.ONGOING);
    const completedCourses = this.storage.getCoursesByStatus(APP_CONFIG.COURSE_STATUS.COMPLETED);

    this.renderCourseList(APP_CONFIG.DOM_LIST_SELECTORS.ONGOING, ongoingCourses);
    this.renderCourseList(APP_CONFIG.DOM_LIST_SELECTORS.COMPLETED, completedCourses);
  }

  renderCourseList(listSelector, courses) {
    const listElement = document.querySelector(listSelector);
    listElement.innerHTML = '';
    
    if (courses.length === 0) {
      this.renderEmptyMessage(listElement);
      return;
    }

    let innerHTML = '';
    courses.forEach(course => {
      const stats = calculateCourseStats(course);
      innerHTML += `
        <li class="course-item" course-id="${stats.id}">
          <div class="course-content">
            <div class="course-infos">
              <h3 class="course-title">${stats.title}</h3>
              <div class="course-details">
                <div class="course-section">
                  <h4>⏱️ Cronograma</h4>
                  <p>
                    <strong>Duração Total:</strong>
                    <span>${stats.totalDuration}</span>
                  </p>
                  <p>
                    <strong>Horas Restantes:</strong>
                    <span>${stats.hoursRemaining}</span>
                  </p>
                  <p>
                    <strong>Horas por Dia:</strong>
                    <span>${stats.dailyStudy}</span>
                  </p>
                  <p>
                    <strong>Data da Finalização:</strong>
                    <span>${stats.targetDate}</span>
                  </p>
                </div>
                <div class="course-section">
                  <h4>📅 Dias & Descanso</h4>
                  <p>
                    <strong>Dias Restantes:</strong>
                    <span>${stats.totalDays}</span>
                  </p>
                  <p>
                    <strong>Dias de Estudo:</strong>
                    <span>${stats.studyDays}</span>
                  </p>
                  <p>
                    <strong>Dias de Folga:</strong>
                    <span>${stats.daysOff}</span>
                  </p>
                  <p>
                    <strong>Dias de Descanso:</strong>
                    <span>${stats.daysOffNames.join(', ')}</span>
                  </p>
                </div>
              </div>
              <div class="course-progress">
                <div class="progress-header">
                  <span class="progress-title">Progresso do Curso</span>
                  <span class="progress-percentage">${stats.progressPercentage}</span>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar" style="width: ${stats.progressPercentage};"></div>
                </div>
                <div class="progress-text">
                  <span>${stats.progressCompleted} concluído</span>
                </div>
              </div>
            </div>
            <div class="course-actions">
              ${
                stats.status === APP_CONFIG.COURSE_STATUS.ONGOING ? 
                `
                  <button class="progress-button" data-id="${stats.id}" data-action="progress-modal">Progresso</button>
                  <button class="complete-button" data-id="${stats.id}" data-action="toggle-status">Finalizar</button>
                ` : 
                `
                  <button class="reopen-button" data-id="${stats.id}" data-action="toggle-status">Reabrir</button>
                `
              }
              <button class="edit-button" data-id="${stats.id}" data-action="edit-modal">Editar</button>
              <button class="delete-button" data-id="${stats.id}" data-action="delete">Excluir</button>
            </div>
          </div>
        </li>
      `;
    });

    listElement.innerHTML = innerHTML;

    listElement.querySelectorAll('button[data-action]').forEach(btn => {
      const dataId = btn.getAttribute('data-id');
      const course = this.storage.getCourseById(dataId);

      btn.addEventListener('click', (e) => {
        const dataAction = btn.getAttribute('data-action');

        switch(dataAction) {
          case 'progress-modal':
            this.progressModal.open(course);
            break;
          case 'toggle-status':
            this.handleToggleCourseStatus(course);
            break;
          case 'edit':
            this.editModal.open(course);
            break;
          case 'delete':
            this.handleDeleteCourse(course);
            break;
        }
      });
    });
  }

  renderEmptyMessage(container) {
    if (`#${container.id}` === APP_CONFIG.DOM_LIST_SELECTORS.ONGOING) {
      container.innerHTML = `
      <li class="empty-message">
      <div class="empty-icon">📚</div>
      <h3 class="empty-title">Nenhum curso em andamento</h3>
      <p class="empty-subtitle">Clique em "Criar Novo Plano" para começar seus estudos!</p>
      </li>
      `;
    } else if (`#${container.id}` === APP_CONFIG.DOM_LIST_SELECTORS.COMPLETED) {
      container.innerHTML = `
        <li class="empty-message">
          <div class="empty-icon">🎓</div>
          <h3 class="empty-title">Nenhum curso finalizado</h3>
          <p class="empty-subtitle">Complete seus primeiros cursos para vê-los aqui!</p>
        </li> 
      `;
    }
  }

}

new StudyPlannerApp();

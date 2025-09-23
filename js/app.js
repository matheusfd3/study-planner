import { APP_CONFIG } from './config.js';
import { StorageManager } from './modules/storage.js';
import { getCourseStats } from './modules/courseCalculations.js';

class StudyPlannerApp {
  constructor() {
    this.storage = new StorageManager(APP_CONFIG.STORAGE_KEY);
    this.initializeApp();
  }

  initializeApp() {
    document.addEventListener('DOMContentLoaded', () => {
      this.bindEventListeners();
      this.loadCourseList();
    });
  }

  bindEventListeners() {
    window.addEventListener('storage', (event) => {
      if (event.key === APP_CONFIG.STORAGE_KEY) {
        this.loadCourseList();
      }
    });
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
      const stats = getCourseStats(course);
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
                    <strong>Horas por Dia:</strong>
                    <span>${stats.hoursPerDay}</span>
                  </p>
                  <p>
                    <strong>Horas Restantes:</strong>
                    <span>${stats.hoursRemaining}</span>
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
                    <span>${stats.daysRemaining} dias</span>
                  </p>
                  <p>
                    <strong>Dias de Estudo:</strong>
                    <span>${stats.studyDays} dias</span>
                  </p>
                  <p>
                    <strong>Dias de Folga:</strong>
                    <span>${stats.restDays} dias</span>
                  </p>
                  <p>
                    <strong>Dias de Descanso:</strong>
                    <span>${stats.restDayNames.join(', ')}</span>
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
                  <button class="progress-button" onClick="${() => {this.progressModal.open(course)}}">Progresso</button>
                  <button class="complete-button" onClick="${() => {handleCompleteCourse(stats.id)}}">Finalizar</button>
                ` : 
                `
                  <button class="reopen-button" onClick="${() => {handleReopenCourse(stats.id)}}">Reabrir</button>
                `
              }
              <button class="edit-button" onClick="${() => {this.editModal.open(course)}}">Editar</button>
              <button class="delete-button" onClick="${() => {handleDeleteCourse(stats.id)}}">Excluir</button>
            </div>
          </div>
        </li>
      `;
    });

    listElement.innerHTML = innerHTML;
  }

  renderEmptyMessage(container) {
    if (container.id === APP_CONFIG.DOM_LIST_SELECTORS.ONGOING) {
      container.innerHTML = `
        <li class="empty-message">
          <div class="empty-icon">📚</div>
          <h3 class="empty-title">Nenhum curso em andamento</h3>
          <p class="empty-subtitle">Clique em "Criar Novo Plano" para começar seus estudos!</p>
        </li>
      `;
    } else if (container.id === APP_CONFIG.DOM_LIST_SELECTORS.COMPLETED) {
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

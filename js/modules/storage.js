export class MyStorageManager {
  constructor(storageKey) {
    this.storageKey = storageKey;
  }

  getCourses() {
    const coursesJSON = localStorage.getItem(this.storageKey);
    return coursesJSON ? JSON.parse(coursesJSON) : [];
  }

  getCourseById(id) {
    return this.getCourses().find(course => course.id === id);
  }

  getCoursesByStatus(status) {
    return this.getCourses().filter(course => course.status === status);
  }

  saveCourses(courses) {
    localStorage.setItem(this.storageKey, JSON.stringify(courses));
  }

  addCourse(newCourse) {
    const courses = this.getCourses();
    courses.push(newCourse);
    this.saveCourses(courses);
  }

  updateCourse(updatedCourse) {
    const courses = this.getCourses();
    const index = courses.findIndex(course => course.id === updatedCourse.id);
    if (index !== -1) {
      courses[index] = updatedCourse;
      this.saveCourses(courses);
    }
  }

  deleteCourse(id) {
    let courses = this.getCourses();
    courses = courses.filter(course => course.id !== id);
    this.saveCourses(courses);
  }
}

app.factory('todoService', ['$http', ($http) => {
    return {
        // Get all tasks
        getToDos: function () {
            return $http.get('/api/tasks');
        },

        // Get all projects
        getProjects: function () {
            return $http.get('/api/projects');
        },

        // Create project
        createProject: function (projectData) {
            return $http.post('/api/project', projectData);
        },

        // Update project
        updateProject: function (project) {
            return $http.put('/api/project/' + project.id, project);
        },

        // Delete project
        deleteProject: function (id) {
            return $http.delete('/api/project/' + id);
        },

        // Get all users (for assignee dropdown)
        getUsers: function () {
            return $http.get('/api/users');
        },

        // Add new task
        createToDo: function (newToDo) {
            return $http.post('/api/task', newToDo);
        },

        // Login
        login: function (credentials) {
            return $http.post('/api/login', credentials);
        },

        // Register
        register: function (data) {
            return $http.post('/api/register', data);
        }


    };
}]);
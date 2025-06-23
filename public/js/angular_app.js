/*
    Params:
        'app.todos': angular app name
        []: other dependencies/modules
*/
let app = angular.module('app.todos', ['xeditable']);

/*
    ['$scope', '$log', ...]: services in angular will be used in controller
*/
app.controller('todoController', ['$scope', 'todoService', ($scope, todoService) => {
    $scope.appName = "TO-DO Dashboard";
    $scope.formData = {};
    $scope.todos = [];
    $scope.projects = [];
    $scope.users = [];
    $scope.loading = true;
    $scope.showAddForm = false;
    $scope.projectForm = {};

    // Start - Toggle AddForm
    $scope.toggleAddForm = () => {
        $scope.showAddForm = !$scope.showAddForm;
    };

    // Handle toggle for Add Project section
    $scope.addProject = () => {
        if (!$scope.projectForm.name) return;

        todoService.createProject($scope.projectForm).then(res => {
            $scope.projects.push(res.data);
            $scope.projectForm = {};
            $scope.showAddForm = false; // Auto-hide
        });
    };

    // Handle toggle for Add Task section
    $scope.addToDo = () => {
        if (!$scope.formData.title) return;

        todoService.createToDo($scope.formData).then(res => {
            $scope.formData = {};
            $scope.showAddForm = false; // Auto-hide
            $scope.refreshTasks();
            $scope.refreshProjects();
        });
    };
    // End - Toggle AddForm

    // Get all tasks
    todoService.getToDos().then((response) => {
        $scope.todos = response.data;
        $scope.loading = false;
    });

    // Get all projects
    todoService.getProjects().then((response) => {
        $scope.projects = response.data;
        $scope.loading = false;
    });

    // Create new project
    $scope.addProject = () => {
        if (!$scope.projectForm.name) return;
        todoService.createProject($scope.projectForm).then((res) => {
            $scope.projects.push(res.data);
            $scope.projectForm = {};
            $scope.showAddForm = false;
        });
    };

    // Edit project (prepare for editing)
    $scope.editingProject = null;

    $scope.startEditProject = (project) => {
        $scope.editingProject = angular.copy(project);
    };

    // Confirm edit
    $scope.updateProject = () => {
        if (!$scope.editingProject.name) return;

        todoService.updateProject($scope.editingProject).then(res => {
            // update in UI
            const index = $scope.projects.findIndex(p => p.id === res.data.id);
            if (index !== -1) $scope.projects[index] = res.data;
            $scope.editingProject = null;
            $scope.refreshProjects();
            $scope.refreshTasks();
        });
    };

    // Cancel project edit
    $scope.cancelEdit = () => {
        $scope.editingProject = null;
    };

    // Delete project
    $scope.deleteProject = (project) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        todoService.deleteProject(project.id).then(() => {
            $scope.projects = $scope.projects.filter(p => p.id !== project.id);
            $scope.refreshTasks();
        });
    };

    // Get all users
    todoService.getUsers().then((response) => {
        $scope.users = response.data;
        $scope.loading = false;
    });

    // Reload data for task table
    $scope.refreshTasks = () => {
        todoService.getToDos().then((response) => {
            $scope.todos = response.data;
        });
    };

    // Reload data for project table
    $scope.refreshProjects = () => {
        todoService.getProjects().then((response) => {
            $scope.projects = response.data;
        });
    };

}]);

app.controller('authController', ['$scope', '$http', '$window', 'todoService', function ($scope, $http, $window, todoService) {
    $scope.loginData = {};
    $scope.registerData = {};

    $scope.login = function () {
        todoService.login($scope.loginData).then(res => {
            localStorage.setItem('token', res.data.token);
            $window.location.href = '/';
        }).catch(err => {
            $scope.loginError = err.data.message;
        });
    };

    $scope.register = function () {
        todoService.register($scope.registerData).then(() => {
            $window.location.href = '/login';
        }).catch(err => {
            $scope.registerError = err.data.message;
        });
    };
}]);

angular.module('ToDo', ['ionic'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
  .controller("ToDoCtrl", function ($scope, $ionicModal, $timeout) {
    if (!angular.isUndefined(window.localStorage['tasks'])) {
      $scope.tasks = JSON.parse(window.localStorage['tasks']);
    } else {
      $scope.tasks = [
        {title: 'Buy', description: 'You must buy', done: false},
        {title: 'try', description: 'You must buy', done: false},
        {title: 'sell', description: 'You must buy', done: true},
      ];
    }

    $ionicModal.fromTemplateUrl('views/task.html', function (modal) {
      $scope.taskModal = modal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    })

    $scope.currentTaskId = -1;

    $scope.addNewTask = function () {
      $scope.taskModal.show();
      $scope.activeTask = {
        title: '',
        description: '',
        done: false
      }
      $scope.currentTaskId = -1;
    }
    $scope.closeTask = function () {
      $scope.taskModal.hide();
    }
    $scope.openTask = function (id) {
      var task = $scope.tasks[id];
      $scope.currentTaskId = id;
      $scope.activeTask = {
        title: task.title,
        description: task.description,
        done: task.done
      }
      $scope.taskModal.show();
    }
    $scope.deleteTask = function (id) {
      $scope.tasks.splice(id, 1);
      saveItems();
    }
    $scope.submitTask = function (task) {
      if ($scope.currentTaskId == -1) {
        $scope.tasks.push({
          title: task.title,
          description: task.description,
          done: task.done
        });
      } else {
        var id = $scope.currentTaskId;
        $scope.tasks[id].title = task.title;
        $scope.tasks[id].description = task.description;
        $scope.tasks[id].done = task.done;
      }

      saveItems();

      $scope.taskModal.hide();
    }
    $scope.saveTasks = function () {
      $timeout(function () {
        saveItems();
      });
    }
    $scope.rng = 5;
    function saveItems() {
      window.localStorage['tasks'] = angular.toJson($scope.tasks);
    }
  });

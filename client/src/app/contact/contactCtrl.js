// contact controller ===================
// angular controller to send user messages, including routes to call backend api
// front end does not connect to mongo libraries, therefore api routes needed
angular.module('rbApp').controller('contactCtrl', [
    '$scope', 'messageSvc', '$log',
    function($scope, messageSvc, $log) {
        $scope.submitting = false;
        $scope.submitted = false;
        $scope.send = function() {
            $scope.submitting = true;
            $scope.contact.date = Date.now();
            setTimeout(function() { // pausing execution to show loading bar, remove when moving to prod
                messageSvc.sendMessage($scope.contact).then(function(res) {
                    if (res.success) {
                        $scope.submitted = true;
                    }
                    $scope.response = res;
                    $scope.contact = "";
                    $scope.formContact.$setPristine();
                    $scope.formContact.$setUntouched();
                    $scope.submitting = false;
                });
            }, 2000);
        };
    }
]);
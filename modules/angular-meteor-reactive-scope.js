/**
 * Created by netanel on 29/12/14.
 */
var angularMeteorReactiveScope = angular.module('angular-meteor.reactive-scope', []);

angularMeteorReactiveScope.run(['$rootScope', '$parse', function($rootScope, $parse) {
  Object.getPrototypeOf($rootScope).getReactively = function(property) {
    var self = this;
    var getValue = $parse(property);

    if (!self.hasOwnProperty('$$trackerDeps')) {
      self.$$trackerDeps = {};
    }

    if (!self.$$trackerDeps[property]) {
      self.$$trackerDeps[property] = new Tracker.Dependency();

      self.$watch(function() {
        return getValue(self)
      }, function(newVal, oldVal) {
        if (newVal !== oldVal) {
          self.$$trackerDeps[property].changed();
        }
      });
    }

    self.$$trackerDeps[property].depend();

    return getValue(self);
  };
}]);

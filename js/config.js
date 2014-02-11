var require = {
    baseUrl: './js',
    paths: {
        jquery: '//code.jquery.com/jquery-2.1.0.min',
        angular: '//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min',
        d3: '//d3js.org/d3.v3.min',
        underscore: '//underscorejs.org/underscore-min'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        underscore: {
            exports: '_'
        }
    }
};
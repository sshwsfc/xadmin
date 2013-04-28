
statics = {
    "bootstrap": {
        'js': {
            'dev': 'xadmin/vendor/bootstrap/bootstrap.js',
            'production': 'xadmin/vendor/bootstrap/bootstrap.min.js',
            'cdn': 'http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js'
        },
        'css': {
            'dev': ['xadmin/vendor/bootstrap/bootstrap.css', 'xadmin/vendor/bootstrap/bootstrap-responsive.css'],
            'production': ['xadmin/vendor/bootstrap/bootstrap.css', 'xadmin/vendor/bootstrap/bootstrap-responsive.css'],
            'cdn': 'http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css'
        }
    },
    'jquery': {
        "js": {
            'dev': 'xadmin/vendor/jquery/jquery.js',
            'production': 'xadmin/vendor/jquery/jquery.min.js',
        },
        "ui": {
            "js": {"dev": "xadmin/js/jquery-ui.js"}
        }
    },
    "font-awesome": {
        "css": {
            'dev': 'xadmin/vendor/font-awesome/css/font-awesome.css',
            'production': 'xadmin/vendor/font-awesome/css/font-awesome.min.css',
        }
    },
    "timepicker": {
        "css": {
            'dev': 'xadmin/vendor/bootstrap-timepicker/css/bootstrap-timepicker.css',
            'production': 'xadmin/vendor/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
        },
        "js": {
            'dev': ['xadmin/vendor/bootstrap-timepicker/js/bootstrap-timepicker.js', 'xadmin/js/widgets/datetime.js'],
            'production': 'xadmin/vendor/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
        }
    },
    "datepicker": {
        "css": {
            'dev': 'xadmin/vendor/bootstrap-datepicker/css/datepicker.css'
        },
        "js": {
            'dev': ['xadmin/vendor/bootstrap-datepicker/js/bootstrap-datepicker.js', 'xadmin/js/widgets/datetime.js'],
        }
    },
    "flot": {
        "js": {
            'dev': ['xadmin/vendor/flot/jquery.flot.js', 'xadmin/vendor/flot/jquery.flot.pie.js', 'xadmin/vendor/flot/jquery.flot.time.js', 
                'xadmin/vendor/flot/jquery.flot.resize.js', 'xadmin/js/charts.js']
        }
    },
    "image-gallery": {
        "css": {
            'dev': 'xadmin/vendor/bootstrap-image-gallery/css/bootstrap-image-gallery.css',
            'production': 'xadmin/vendor/bootstrap-image-gallery/css/bootstrap-image-gallery.min.css',
        },
        "js": {
            'dev': ['xadmin/vendor/load-image/load-image.js', 'xadmin/vendor/bootstrap-image-gallery/js/bootstrap-image-gallery.js'],
            'production': ['xadmin/vendor/load-image/load-image.min.js', 'xadmin/vendor/bootstrap-image-gallery/js/bootstrap-image-gallery.min.js']
        }
    },
    "select2": {
        "css": {
            'dev': 'xadmin/vendor/select2/select2.css',
        },
        "js": {
            'dev': 'xadmin/vendor/select2/select2.js',
            'production': 'xadmin/vendor/select2/select2.min.js',
        }
    },
    "multiselect": {
        "css": {
            'dev': 'xadmin/vendor/bootstrap-multiselect/css/bootstrap-multiselect.css',
        },
        "js": {
            'dev': ['xadmin/vendor/bootstrap-multiselect/js/bootstrap-multiselect.js', 'xadmin/js/widgets/multiselect.js'],
        }
    },
}
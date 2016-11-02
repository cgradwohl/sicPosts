// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};

    function get_posts_url(start_idx, end_idx) {
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return posts_url + "?" + $.param(pp);
    }



    self.get_posts = function() {
        $.getJSON(get_posts_url(0,4), function (data){
            self.vue.posts     = data.posts;
            self.vue.has_more  = data.has_more;
            self.vue.logged_in = data.logged_in;
            console.log(data);
        });
    }

    self.get_more = function() {
        var num_posts = self.vue.posts.length;
        $.getJSON(get_posts_url(num_posts, num_posts + 4), function (data){
            self.vue.has_more  = data.has_more;
            self.extend(self.vue.posts, data.posts);
        })
    }



    self.adding_post_button = function(){
        self.vue.adding_post = !self.vue.adding_post;
    };



    self.add_post = function() {
        self.vue.adding_post = !self.vue.adding_post;
        console.log("before POST method");
        $.post(add_post_url,
            {
                post_content: self.vue.form_post
            },

            function(data){
                $.web2py.enableElement($("#add_post_submit"));
                self.vue.posts.unshift(data.post);
                //console.log(data.post);
            });

    };




    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            has_more: false,
            logged_in: false,
            adding_post: false,
            form_post: null,
            posts: []
        },
        methods: {
            get_more: self.get_more,
            adding_post_button: self.adding_post_button,
            add_post: self.add_post,
        }

    });

    self.get_posts();
    $("#vue-div").show();


    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});

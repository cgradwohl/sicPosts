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
            enumerate(self.vue.posts);
            console.log(data);
            console.log("get data");
        });

    }

    self.get_more = function() {

        var num_posts = self.vue.posts.length;
        $.getJSON(get_posts_url(num_posts, num_posts + 4), function (data){
            self.vue.has_more  = data.has_more;
            self.extend(self.vue.posts, data.posts);
            enumerate(self.vue.posts);

        })

    }


    self.adding_post_button = function() {
        self.vue.adding_post = !self.vue.adding_post;
    };

    self.editing_post_button = function() {
        self.vue.editing_post = !self.vue.editing_post;
        self.vue.adding_post = !self.vue.adding_post;
    };

    self.edit_post = function(post_idx) {
        self.vue.editing_post = !self.vue.editing_post;
        self.vue.adding_post = !self.vue.adding_post;
        console.log("before edit");


        $.post(edit_post_url,
            {
                post_id: self.vue.posts[post_idx].id,

            },
            function(data){
                //self.vue.edit_form_post = data.post_content;
                self.vue.edits = data.post;
                console.log(data);
            });
        console.log("after edit");

    };


    self.add_post = function() {
        self.vue.adding_post = !self.vue.adding_post;
        console.log("add_post");
        $.post(add_post_url,
            {
                post_content: self.vue.form_post
            },

            function(data){
                $.web2py.enableElement($("#add_post_submit"));
                self.vue.posts.unshift(data.post);
                enumerate(self.vue.posts);
                self.vue.form_post = null;

            });

    };


    self.del_post = function(post_idx) {

        $.post(del_post_url,
            { post_id: self.vue.posts[post_idx].id },
            function () {
                self.vue.posts.splice(post_idx, 1);
                enumerate(self.vue.posts);
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
            editing_post: false,
            form_post: null,
            edit_form_post: null,
            posts: [],
            edits: null
        },
        methods: {
            get_more: self.get_more,
            adding_post_button: self.adding_post_button,
            editing_post_button: self.editing_post_button,
            add_post: self.add_post,
            edit_post: self.edit_post,
            del_post: self.del_post
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

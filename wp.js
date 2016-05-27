var WP = require( 'wordpress-rest-api' );

var wp = new WP({
    endpoint: 'http://syngulate.com/core/wp-json',
    username: 'syn_bot',
    password: 'R@F1Fnp(4xXjq6K!IC(T(Svk'
});

wp.posts().post({
    title: 'DGZN',
    content: 'SOME CONTENT',
    status: 'publish'
}).then(function( response ) {
    console.log( response.id, response );
})

wp.users().then((users) => {
  console.log(users);
})

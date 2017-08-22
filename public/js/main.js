$(document).ready(function(){
  $('.delete-blogpost').on('click', function(e){
    $target = $(e.target);
    const id = ($target.attr('data-id'));
    $.ajax({
      type:'DELETE',
      url: '/blog/' + id,
      success: function(response){
        alert('Deleting Blog Post');
        window.location.href='/blog';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});

document.getElementById('menu-toggle').addEventListener('click', function() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('active');
  });

  document.getElementById('show-mailchimp-form').addEventListener('click', function() {
    var form = document.getElementById('mc_embed_shell');
    if (form.style.display === 'none' || form.style.display === '') {
      form.style.display = 'block';
    } else {
      form.style.display = 'none';
    }
  });
  

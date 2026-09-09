(function(){
  function setupPasswordEyes(){
    document.querySelectorAll('input[type="password"]').forEach(function(input){
      if(input.dataset.eyeReady==='1') return;
      input.dataset.eyeReady='1';
      var wrap=document.createElement('div');
      wrap.className='password-eye-wrap';
      input.parentNode.insertBefore(wrap,input);
      wrap.appendChild(input);
      var btn=document.createElement('button');
      btn.type='button';
      btn.className='password-eye-btn';
      btn.setAttribute('aria-label','Show password');
      btn.setAttribute('title','Show password');
      btn.textContent='👁️';
      btn.addEventListener('click',function(){
        var visible=input.type==='text';
        input.type=visible?'password':'text';
        btn.textContent=visible?'👁️':'🙈';
        btn.setAttribute('aria-label',visible?'Show password':'Hide password');
        btn.setAttribute('title',visible?'Show password':'Hide password');
      });
      wrap.appendChild(btn);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setupPasswordEyes);
  else setupPasswordEyes();
  new MutationObserver(setupPasswordEyes).observe(document.documentElement,{childList:true,subtree:true});
})();

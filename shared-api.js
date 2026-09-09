window.API_BASE=window.API_BASE||'';
window.SharedData={
 token:()=>sessionStorage.getItem('eliasAdminToken')||'',
 async public(){const r=await fetch(`${window.API_BASE}/api/public`);if(!r.ok)throw Error('Backend unavailable');return r.json()},
 async get(){const r=await fetch(`${window.API_BASE}/api/data`);if(!r.ok)throw Error('Could not load shared data');return r.json()},
 async save(data){const r=await fetch(`${window.API_BASE}/api/data`,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':`Bearer ${this.token()}`},body:JSON.stringify(data)});if(!r.ok)throw Error('Could not save shared data');return r.json()},
 async login(username,password){const r=await fetch(`${window.API_BASE}/api/admin/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});if(!r.ok)throw Error('Invalid admin login');const d=await r.json();sessionStorage.setItem('eliasAdminToken',d.token);return d},
 async logout(){try{await fetch(`${window.API_BASE}/api/admin/logout`,{method:'POST',headers:{'Authorization':`Bearer ${this.token()}`}})}finally{sessionStorage.removeItem('eliasAdminToken')}}
};

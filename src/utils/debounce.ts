export function debounce<T extends (...a:any)=>void>(fn:T, ms:number){
  let t:any; return (...a:any) => { clearTimeout(t); t=setTimeout(()=>fn(...a), ms); };
}

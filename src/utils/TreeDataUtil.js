export function filterNoChild(data){
  if(data instanceof  Array){
    for(let o in data){
      let obj = data[o]
      if(obj.children!=undefined && obj.children.length==0){
        delete obj.children;
      }else{
        filterNoChild(obj);
      }
    }
  }else if(data instanceof Object){
    if(data.children!=undefined && data.children.length==0){
      delete data.children;
    }else{
      filterNoChild(data.children);
    }
  }
  return data
}

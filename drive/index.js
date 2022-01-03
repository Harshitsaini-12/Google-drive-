(function(){
    let btnAddFolder = document.querySelector("#btnAddFolder");
    let divContainer = document.querySelector("#divContainer");
    let pageTemplates = document.querySelector("#pageTemplates");
    let divBreadCrumb=document.querySelector(".breadcrumb");
    let aPath=document.querySelector(".path");
    let fid=-1;
    let folders=[];
    let cfid=-1;
    let pid=-1;
    
    aPath.addEventListener("click",navigateBread);

    btnAddFolder.addEventListener("click",addFolder);

    function addFolder(){
        
        let fname = prompt("Folder name?");
        if(!fname){
            return;
        }
        
        fid++;

        folders.push({
            name:fname,
            id:fid,
            pid:cfid
        });

        addFolderPage(fname,fid,cfid);
        persist();
    }
    
    function deleteFolder(){
        let divFolder=this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let fitbd=parseInt(divFolder.getAttribute("fid"))
        let flag=confirm("Are you sure you want to delete"+divName.innerHTML);

        if(flag){
          let exists=folders.some(f => f.pid==fitbd);

          if(exists){
            divContainer.removeChild(divFolder);
            let idx=folders.findIndex(f=>f.id==fitbd);
            folders.splice(idx,1);
            persist();
          }else{
              alert("Can't delete. Has children");
          }
          

        }
    }

    function editFolder(){
        let fname=prompt("Enter the new folder name");
        if(!fname){
            return;
        }
        let divFolder=this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
         
        divName.innerHTML=fname;
        let folder=folders.find(f=>f.id==cfid).some(f => f.name == fname);
        folder.name=fname;
        persist();
    }

    function viewFolder(){
        let divFolder=this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");

        cfid=parseInt(divFolder.getAttribute("fid"));
     let aPathTemplate=pageTemplates.content.querySelector(".path");
     let aPath=document.importNode(aPathTemplate,true);

     aPath.innerHTML=divName.innerHTML;
     divBreadCrumb.appendChild(aPath);
     aPath.setAttribute("fid",cfid);
     aPath.addEventListener("click",navigateBread);

        divContainer.innerHTML="";
        folders.filter(f => f.pid==cfid).forEach(f =>{
            addFolder(f.name,f.id,f.pid);
        })
    }

    function navigateBread(){
      let fname=this.innerHTML;
      cfid=parseInt(this.getAttribute("fid"));

      divContainer.innerHTML="";

      folders.filter(f=>f.pid==cfid).forEach(f=>{
          addFolder(f.name,f.id,f.pid);
      })

      while(this.nextSibling){
          this.parentNode.removeChild(this.nextSibling);
      }
    }

    function addFolderPage(fname,fid,cfid){
        let divFolderTemplate = pageTemplates.content.querySelector(".folder");

        let divFolder = document.importNode(divFolderTemplate,true);
        let divName = divFolder.querySelector("[purpose='name']");
       
        divName.innerHTML = fname;
        divFolder.setAttribute("fid",fid);
        divFolder.setAttribute("pid",pid);

        let spanDelete=divFolder.querySelector("span[action='delete']");
        spanDelete.addEventListener("click",deleteFolder);

        let spanEdit=divFolder.querySelector("span[action='edit']");
        spanEdit.addEventListener("click",editFolder);

        let viewPage=divFolder.querySelector("span[action='view']");
        viewPage.addEventListener("click",viewFolder);

        divContainer.appendChild(divFolder);
    }

    function persist(){
       console.log(folders);

       let fjson=JSON.stringify(folders);
       localStorage.setItem("data",fjson);
    }
   
    function pageLoad(){
      let fjson=localStorage.getItem("data");

      // !!fjson --> fjson is not null and there is item in fjson.

      if(!!fjson){
          folders=JSON.parse(fjson);
          let maxID=-1;

          folders.forEach(f=>{
             
              if(f.id > maxID){
                  maxID=f.id;
              }
              if(f.id==cfid){
                addFolderPage(f.name,f.id);
              }

              
            })
          fid=maxID;
      }

    }

    pageLoad();
})();



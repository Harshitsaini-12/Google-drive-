(function(){
    let btnAddFolder = document.querySelector("#btnAddFolder");
    let divContainer = document.querySelector("#divContainer");
    let pageTemplates = document.querySelector("#pageTemplates");

    let fid=0;
    let folders=[];


    btnAddFolder.addEventListener("click",addFolder);

    function addFolder(){
        
        let fname = prompt("Folder name?");
        if(!fname){
            return;
        }
        
        fid++;
        addFolderPage(fname,fid);

        folders.push({
            name:fname,
            id:fid
        });
        persist();
    }
    
    function deleteFolder(){
        let divFolder=this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");

        let flag=confirm("Are you sure you want to delete"+divName.innerHTML);

        if(flag){
          
            divContainer.removeChild(divFolder);
            let idx=folders.findIndex(f=>f.id==parseInt(divFolder.getAttribute("fid")));
            folders.splice(idx,1);
            persist();

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
        let folder=folders.find(f=>f.id==parseInt(divFolder.getAttribute("fid")));
        folder.name=fname;
        persist();
    }

    function addFolderPage(fname,fid){
        let divFolderTemplate = pageTemplates.content.querySelector(".folder");

        let divFolder = document.importNode(divFolderTemplate, true);
        let divName = divFolder.querySelector("[purpose='name']");
       
        divName.innerHTML = fname;
        divFolder.setAttribute("fid",fid);

        let spanDelete=divFolder.querySelector("span[action='delete']");
        spanDelete.addEventListener("click",deleteFolder);

        let spanEdit=divFolder.querySelector("span[action='edit']");
        spanEdit.addEventListener("click",editFolder);
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
          folders.forEach(function(f){
              addFolderPage(f.name,f.id);
          })
      }

    }

    pageLoad();
})();



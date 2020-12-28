import { Controller } from "stimulus"

export default class extends Controller {
    static targets = ["item", "name", "content"];

    initialize() {
        this.index = 0;
      //  switchItem();
        this.activate(this.index);
    }

    toggle(ind) {
        this.nameTargets[ind].classList.toggle('active');
        if(!!this.contentTargets[ind].style.maxHeight) {
            this.contentTargets[ind].style.maxHeight = null;
            this.index = -1;
        } else {
            this.contentTargets[ind].style.maxHeight = this.contentTargets[ind].scrollHeight + "px";
            this.index = ind;
        }
        
    }
    switchItem(e) {
        let currentIndex = this.nameTargets.indexOf(e.target);
        console.log('current', currentIndex);
        if (this.index==currentIndex) {
            this.toggle(currentIndex);
            return;
        }
        
        if (this.index != -1) {
          //  this.deactivate(this.index);
          this.toggle(this.index);
        }
        this.toggle(currentIndex);
        /* console.log(this.nameTargets)
        this.nameTargets.forEach((element, index) => {
            if (element === e.target) {
                if(index==this.index) {
                    this.index = -1;
                    
                } else {
                    this.activate(index);
                    this.index = index;
                }
            }
        }); */
       
    }

    

    activate(ind) {
        this.nameTargets[ind].classList.add('active');
        this.contentTargets[ind].style.maxHeight = this.contentTargets[ind].scrollHeight + "px";
    }

    deactivate(ind){
        this.nameTargets[ind].classList.remove('active');
        this.contentTargets[ind].style.maxHeight = null;
    }

    /* show() {
        this.itemTargets.forEach((element, index) => {
          element.hidden = index != this.index
        })
      } */
}
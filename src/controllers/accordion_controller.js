import { Controller } from "stimulus"

export default class extends Controller {
    static targets = ["item", "name", "content"];

    initialize() {
        this.index = 0;
      //  switchItem();
        this.activate(this.index);
    }

    switchItem(e) {
      //  let currentIndex = this.index;
        if (this.index != -1) {
            this.deactivate(this.index);
        }
        console.log(this.nameTargets)
        this.nameTargets.forEach((element, index) => {
            if (element === e.target) {
                if(index==this.index) {
                    this.index = -1;
                    
                } else {
                    this.activate(index);
                    this.index = index;
                }
            }
        });
       
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
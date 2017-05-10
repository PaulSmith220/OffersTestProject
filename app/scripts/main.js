import DataService from "./DataService";
import "../styles/styles.scss";


const dataService = new DataService();
let $offersContainer = null;
let dialog = null;

document.addEventListener("DOMContentLoaded", () => {

    // Setting a dialog window
    dialog = document.querySelector('#dialog');
    initDialog(dialog);

    // Loading data
    $offersContainer = document.getElementById("overview");
    dataService.loadList().then(data => {

        $offersContainer.innerHTML = "";
        dataService.offers.forEach(item => {
            item.domNode = item.getNode();
            $offersContainer.appendChild(item.domNode);

        });

        componentHandler.upgradeDom();
    });

    dataService.onUpdate = () => {
        dialog.classList.add("flip");
        setTimeout(()=>{
            //dialog.close();
            dialog.classList.add("dissapear");
            setTimeout(()=>{
                if (dialog.open) {
                    dialog.close();
                }
                dialog.classList.remove("dissapear");
                dialog.classList.remove("flip");
            }, 250);
        }, 500);

    };


    document.getElementById("add").addEventListener("click", () => {
        let item = dataService.addItem();
        item.domNode = item.getNode();
        $offersContainer.insertBefore(item.domNode, $offersContainer.firstChild);
        item.showInDialog();

    });

});

// Initialize dialog (with fallback for old browsers).
// If dialog already initialized, replace it with clone to prevent eventListeners confusion
const initDialog = (node) => {
    if (dialog.dataset["ready"]) {
        let newDialog = dialog.cloneNode(true);
        dialog.parentNode.replaceChild(newDialog, dialog);
        dialog = newDialog;
    } else {
        dialog.dataset["ready"] = true;
    }


    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('button.cancel')
        .addEventListener('click', function() {
            dialog.close();
            initDialog(dialog);
        });

};

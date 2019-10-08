import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index";

interface ICar {
    id: number;
    model: string;
    vendor: string;
    price: number;
}
interface IOwner {
    id: number;
    name: string;
    cars: Array<ICar>;
}

let baseUri: string = "https://itemservice-mort237d.azurewebsites.net/api/Cars";

let buttonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("getAllButton");
buttonElement.addEventListener("click", showAllCars);

let outputElement: HTMLDivElement = <HTMLDivElement>document.getElementById("content");

let buttonByIdElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("getByIdButton");
buttonByIdElement.addEventListener("click", showCarById);

let buttonSearchElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("searchButton");
buttonSearchElement.addEventListener("click", showCarBySearch);

let selectedElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById("selector");

let buttonPriceRangeElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("searcByPricehButton");
buttonPriceRangeElement.addEventListener("click", priceRangeCar);

let buttonPutElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("changeCarButton");
buttonPutElement.addEventListener("click", putCar);

let putSelectedElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById("putSelector");

let buttonDeleteElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("deleteButton");
buttonDeleteElement.addEventListener("click", deleteCar);

let addButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("addButton");
addButton.addEventListener("click", addCar);

let resetButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("resetButton");
resetButton.addEventListener("click", Reset);

function Reset(): void{
    axios.get(baseUri + "/reset");
}

GetCarsToselector();

function GetCarsToselector(): void {
    axios.get<ICar[]>(baseUri)
        .then(function (response: AxiosResponse<ICar[]>): void {
            response.data.forEach((car: ICar) => {
                let i = document.createElement("option");
                i.value = CarToString(car);
                i.text = CarToString(car);
                putSelectedElement.options.add(i);
            });
        })
        .catch(function (error: AxiosError): void { // error in GET or in generateSuccess?
            if (error.response) {
                outputElement.innerHTML = error.message;
            } else {
                outputElement.innerHTML = error.message;
            }
        });
}

function CarToString(car: ICar): string{
    return car.vendor + " " + car.model + ", kr. " + car.price + ",-";
}

let ownerButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("getAllOwnersButton");
ownerButton.addEventListener("click", showAllOwners);

/*
function showAllOwners(): void {
    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("ownersContent");
    axios.get<IOwner[]>("https://itemservice-mort237d.azurewebsites.net/api/carowners")
        .then(function (response: AxiosResponse<IOwner[]>): void {
            let result: string = "<ul id='ownerList'>";
            response.data.forEach((owner: IOwner) => {
                result += "<li>" + owner.id + " " + owner.name;
                owner.cars.forEach(car => {
                    result += "<ul><li>" + CarToString(car) + "</ul></li>";
                });
            });
            result += "</li></ul>";
            output.innerHTML = result;
        })
        .catch(function (error: AxiosError): void {
            if (error.response) {
            } else {
                output.innerHTML = error.message;
            }
        });
}
*/

function showAllOwners(): void {
    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("ownersContent");
    axios.get<IOwner[]>("https://itemservice-mort237d.azurewebsites.net/api/carowners")
        .then(function (response: AxiosResponse<IOwner[]>): void {
            let result: string = "<table class='table table-bordered'><thead><tr><th>ID</th><th>Name</th><th>Cars</th></tr></thead><tbody>";
            response.data.forEach((owner: IOwner) => {
                result += "<tr><td>" + owner.id + "</td><td>" + owner.name + "</td><td>";
                owner.cars.forEach(car => {
                    result += "<ul><li>" + CarToString(car) + "</ul></li>";
                });
                result += "</td>"
            });
            result += "</tbody></ttable>";
            output.innerHTML = result;
        })
        .catch(function (error: AxiosError): void {
            if (error.response) {
            } else {
                output.innerHTML = error.message;
            }
        });
}

function showAllCars(): void {
    axios.get<ICar[]>(baseUri)
        .then(function (response: AxiosResponse<ICar[]>): void {
            // element.innerHTML = generateSuccessHTMLOutput(response);
            // outputHtmlElement.innerHTML = generateHtmlTable(response.data);
            // outputHtmlElement.innerHTML = JSON.stringify(response.data);
            let result: string = "<ul id='carList'>";
            response.data.forEach((car: ICar) => {
                result += "<li>" + car.id + " " + car.model + " " + car.vendor + " " + car.price + "</li>";
            });
            result += "</ul>";
            outputElement.innerHTML = result;
        })
        .catch(function (error: AxiosError): void { // error in GET or in generateSuccess?
            if (error.response) {
                // the request was made and the server responded with a status code
                // that falls out of the range of 2xx
                // https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
                outputElement.innerHTML = error.message;
            } else { // something went wrong in the .then block?
                outputElement.innerHTML = error.message;
            }
        });
}

function showCarById(): void {
    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("idContent");
    let inputElement: HTMLInputElement = <HTMLInputElement>document.getElementById("getInput");
    let id: string = inputElement.value;
    let uri: string = baseUri + "/" + id;
    axios.get<ICar>(uri)
        .then(function (response: AxiosResponse<ICar>): void {
            output.innerHTML = "<ul id='idCar'><li>" + response.data.id + " " + response.data.model + " " + response.data.vendor + " " + response.data.price + "</li></ul>";
            console.log(output.innerHTML);
        })
        .catch(function (error: AxiosError): void {
            if (error.response) {
                output.innerHTML = error.message;
            } else {
                output.innerHTML = error.message;
            }
        });
}

function showCarBySearch(): void {
    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("searchContent");
    let inputElement: HTMLInputElement = <HTMLInputElement>document.getElementById("getSearchInput");
    let id: string = inputElement.value;
    let uri: string = baseUri;

    let selector: string = selectedElement.value;
    if (selector === "model") uri += "/Model/" + id;
    else if (selector === "vendor") uri += "/Vendor/" + id;
    else if (selector === "price")  uri += "/Price/" + id;

    axios.get<ICar[]>(uri)
        .then(function (response: AxiosResponse<ICar[]>): void {
            let result: string = "<ul>";
            response.data.forEach((car: ICar) => {
                result += "<li>" + car.id + " " + car.model + " " + car.vendor + " " + car.price + "</li>";
            });
            result += "</ul>";
            output.innerHTML = result;
            /*
            let selector: string = selectedElement.value;
            let result: string = "<ul>";
            console.log(result);
            if (selector === "model") {
                response.data.forEach((car: ICar) => {
                    console.log("model");
                    if (car.model === id) {
                        result += "<li>" + car.id + " " + car.model + " " + car.vendor + " " + car.price + "</li>";
                    }

                });
            }
            else if (selector === "vendor") {
                response.data.forEach((car: ICar) => {
                    console.log("vendor");
                    if (car.vendor === id) {
                        result += "<li>" + car.id + " " + car.model + " " + car.vendor + " " + car.price + "</li>";
                    }

                });
            }
            else if (selector === "price") {
                response.data.forEach((car: ICar) => {
                    console.log("price");
                    if (car.price === +id) {
                        result += "<li>" + car.id + " " + car.model + " " + car.vendor + " " + car.price + "</li>";
                    }

                });
            }
            console.log(result);
            if (result === "<ul>") {
                console.log("result");
                result += "<li>No data</li>"
            }
            result += "</ul>";
            output.innerHTML = result;
            */
        })
        .catch(function (error: AxiosError): void {
            if (error.response) {
                output.innerHTML = error.message;
            } else {
                output.innerHTML = error.message;
            }
        });
}

function priceRangeCar(): void{
    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("searchByPriceContent");
    let lowInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById("lowPriceInput");
    let highInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById("highPriceInput");
    let lowPrice: string = lowInputElement.value;
    let highPrice: string = highInputElement.value;
    let uri: string = baseUri + "/Search?LowPrice=" + lowPrice + "&HighPrice=" + highPrice;
    axios.get<ICar[]>(uri).then(function(response: AxiosResponse<ICar[]>): void{
        let result: string = "<ul>";
            response.data.forEach((car: ICar) => {
                result += "<li>" + car.id + " " + car.model + " " + car.vendor + " " + car.price + "</li>";
            });
            result += "</ul>";
            output.innerHTML = result;
    })
    .catch(function (error: AxiosError): void {
        if (error.response) {
            output.innerHTML = error.message;
        } else {
            output.innerHTML = error.message;
        }
    });
}

function putCar(): void{
    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("putContent");
    let idInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById("idInput");
    let vendorInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById("vendorInput");
    let modelInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById("modelInput");
    let priceInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById("priceInput");
    let myId: string = idInputElement.value;
    let myVendor: string = vendorInputElement.value;
    let myModel: string = modelInputElement.value;
    let myPrice: string = priceInputElement.value;
    let uri: string = baseUri + "/" + myId;

    axios.put<ICar>(uri, {id: myId, model: myModel, vendor: myVendor, price: myPrice})
    .then((response: AxiosResponse) => {
        let message: string = "response " + response.status + " " + response.statusText;
        output.innerHTML = message;
        console.log(message);
    })
    .catch((error: AxiosError) => {
        output.innerHTML = error.message;
        console.log(error);
    })
}

function deleteCar(): void {
    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("contentDelete");
    let inputElement: HTMLInputElement = <HTMLInputElement>document.getElementById("deleteInput");
    let id: string = inputElement.value;
    let uri: string = baseUri + "/" + id;
    axios.delete<ICar>(uri)
        .then(function (response: AxiosResponse<ICar>): void {
            // element.innerHTML = generateSuccessHTMLOutput(response);
            // outputHtmlElement.innerHTML = generateHtmlTable(response.data);
            console.log(JSON.stringify(response));
            output.innerHTML = response.status + " " + response.statusText;
            console.log(output.innerText);
        })
        .catch(function (error: AxiosError): void { // error in GET or in generateSuccess?
            if (error.response) {
                // the request was made and the server responded with a status code
                // that falls out of the range of 2xx
                // https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
                output.innerHTML = error.message;
            } else { // something went wrong in the .then block?
                output.innerHTML = error.message;
            }
        });
}

function addCar(): void {
    let addModelElement: HTMLInputElement = <HTMLInputElement>document.getElementById("addModel");
    let addVendorElement: HTMLInputElement = <HTMLInputElement>document.getElementById("addVendor");
    let addPriceElement: HTMLInputElement = <HTMLInputElement>document.getElementById("addPrice");
    let myModel: string = addModelElement.value;
    let myVendor: string = addVendorElement.value;
    let myPrice: number = Number(addPriceElement.value);
    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("contentAdd");
    // id is generated by the back-end (REST service)
    axios.post<ICar>(baseUri, { model: myModel, vendor: myVendor, price: myPrice })
        .then((response: AxiosResponse) => {
            let message: string = "response " + response.status + " " + response.statusText;
            output.innerHTML = message;
            console.log(message);
        })
        .catch((error: AxiosError) => {
            output.innerHTML = error.message;
            console.log(error);
        });
}
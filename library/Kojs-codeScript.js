ko.extenders.logChange = function (target, option) {
    target.hasError = ko.observable(false);
    target.validationMessage = ko.observable("");
    function validate(newValue) {
        if (option == 'fName') {
            if (newValue.charAt(0) == 'M') {
                if (newValue.length < 5 || newValue.length > 10) {
                    target.hasError(true);
                    target.validationMessage("Length is 5 - 10 char");
                }else{
                    target.hasError(false);
                    target.validationMessage("");
                }
            } else {
                target.hasError(true);
                target.validationMessage("The first name start with 'M'");
            }
        }

        if (option == 'lName') {
            if (newValue.length < 5 || newValue.length > 10) {
                target.hasError(true);
                target.validationMessage("Length is 5 - 10 char");
            } else {
                target.hasError(false);
                target.validationMessage("");
            }
        }

        if (option == 'age') {
            let number = 0 + newValue;
            if (parseInt(newValue) < 1 || parseInt(newValue) > 99 || number == "0") {
                target.hasError(true);
                target.validationMessage("The age is between 1 - 99");
            } else {
                target.hasError(false);
                target.validationMessage("");
            }
        }
    }


    validate(target());

    target.subscribe(validate);

    return target;
}
//Fake constructor
function createUser(firstName, lastName, age) {
    this.firstName = ko.observable(firstName).extend({ logChange: "fName" });
    this.lastName = ko.observable(lastName).extend({ logChange: "lName" });
    this.age = ko.observable(age).extend({ logChange: "age" });
}
//Get Data
var filterArray = function () {
    var self = this;
    this.sourceArray = [
        { firstName: 'Marcial', lastName: 'Bise' },
        { firstName: 'Kalista', lastName: 'Morrow' },
        { firstName: 'Martina', lastName: 'Schindler' },
        { firstName: 'Lacey', lastName: 'Erdman' },
        { firstName: 'Colleen', lastName: 'Johnston' },
        { firstName: 'London', lastName: 'Springer' },
        { firstName: 'Maddoxx', lastName: 'Hartig' },
        { firstName: 'Jadyne', lastName: 'Hebert' },
        { firstName: 'Madalynn', lastName: 'Crow' },
        { firstName: 'Monzerrat', lastName: 'Wallace' },
        { firstName: 'Malasia', lastName: 'Bradshaw' },
        { firstName: 'Mia', lastName: 'Phillips' },
        { firstName: 'Miraya', lastName: 'Kaye' },
        { firstName: 'Anaya', lastName: 'Navarrete' },
        { firstName: 'Callie', lastName: 'Robertson' },
        { firstName: 'Mariah', lastName: 'Obrien' },
        { firstName: 'Marlen', lastName: 'Justice' },
        { firstName: 'Isys', lastName: 'Babineaux' },
        { firstName: 'Perri', lastName: 'Wynn' },
        { firstName: 'Beckem', lastName: 'Currie' },
        { firstName: 'Madison', lastName: 'Flynn' },
        { firstName: 'Ariana', lastName: 'Herbert' },
        { firstName: 'Isela', lastName: 'Vinci' },
        { firstName: 'Keturah', lastName: 'Buford' },
        { firstName: 'Alayah', lastName: 'Cuadrado' },
        { firstName: 'Nikkita', lastName: 'Mcfarland' },
        { firstName: 'Mckayla', lastName: 'Benavidez' },
    ];
    this.filterArray = [];
    this.sourceArray.forEach(item => {
        let randomAge = Math.floor(Math.random() * 99) + 1;
        // Filter user with fullname length bigger than 12 and firstName begin with 'M' ↓↓↓
        if (item.firstName.length + item.lastName.length > 12 && item.firstName.charAt(0) == "M") {
            self.filterArray.push(new createUser(item.firstName, item.lastName, randomAge));
        }
    });
    return this.filterArray;
}
//Sum Age Available
var totalAge = function (array) {
    var sumValue = 0;
    array().forEach(item => {
        if (item.age()) {
            sumValue += parseInt(item.age());
        }
    });
    return sumValue;
}
//Check position
var position = function (removeList, object) {
    let position = removeList.findIndex(function (item) {
        if (item.firstName == object.firstName && item.lastName == object.lastName && item.age == object.age) {
            return true;
        }
    });
    return position;
}
//Push or Remove observableArray
function exChange(removeList, pushList, object) {
    removeList.remove(object);
    pushList.push(object);
}
//return rank of user
var rank = function (age) {
    var rankUser = " ";
    if (age > 62) {
        rankUser = "Retired";
    }
    if (age < 15) {
        rankUser = "Teenage";
    }
    if (age >= 15 && age <= 62) {
        rankUser = "Adult";
    }
    return rankUser;
}

//View Model
var ViewModel = {
    //Declare
    userCondition: ko.observableArray(filterArray()),
    removeUserList: ko.observableArray([]),
    selectedItem: ko.observable(new createUser('Choose user!', 'Choose user!', 0)),

    //sum age of Available User List
    sumAgeAvailableList: ko.pureComputed({
        read: function () {
            return totalAge(ViewModel.userCondition);
        },
        write: function (value) {
            return value;
        },
        owner: this
    }),

    ////sum age of Available User List
    sumAgeRemoveList: ko.pureComputed({
        read: function () {
            return totalAge(ViewModel.removeUserList);
        },
        write: function (value) {
            return value;
        },
        owner: this
    }),
    //show full name
    fullName: ko.pureComputed({
        read: function () {
            if (ViewModel.selectedItem().firstName() == 'Choose user!') {
                return "No infomation";
            } else {
                return ViewModel.selectedItem().firstName() + " " + ViewModel.selectedItem().lastName() + " is " + rank(ViewModel.selectedItem().age());
            }
        },
        write: function (value) {
            return value;
        },
        owner: this
    }),
    //feature of list
    removeUser: function (item) {
        exChange(ViewModel.userCondition, ViewModel.removeUserList, item);
    },
    undoUser: function (item) {
        exChange(ViewModel.removeUserList, ViewModel.userCondition, item);
    },
    selectUser: function (item) {
        ViewModel.selectedItem(item);
        ViewModel.fullName(ViewModel.selectedItem().firstName + " " + ViewModel.selectedItem().lastName + " is " + rank(ViewModel.selectedItem().age()));
    }
}
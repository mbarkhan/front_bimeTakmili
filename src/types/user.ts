export interface User{
ID: number;
  personelCode: string;
  name: string;
  family: string;
  mobile: string;
  password?:string
  role: number;
  companyId: number;
  company?: Company;
}

export interface Company  {
  id: number;
  name: string;
  comType: number;
};

export interface RegList{

	ID:number;
    userPcode:string;
	user?:   User;
	name      :       string ;
	family     :      string ;
	fatherName  :     string ;
	birthDate    :    string ;
	gender       :    number   ;
	marriedStatus:    number  ;
	nationalCode  :   string ;
	shenasname     :  string ;
	phoneNum        : string ;
	mobileNum     :   string ;
	familyRelation :  number  ;
	relStatus      :  number  ;
	empGroupCode   :  number  ;
	empDate        :  string ;
	basicInsurance :  number    ;
	insuranceCode: string;
	bankCode       :  number ;
	bankAccount    :  string ;
	shaba           : string ;
	bankAccountTp   : string ;
	bankAccountOwner: string ;
	mainPersonelCode:  string 
	mainNationalCode  : string ;
	requestReason: number  ;
	empType      : number  ;
	preInsurance : number    ;
	coverMonths  : number  ;
	companyName  : string ;
	documents    : string ;
	regConfirmed: boolean;
}
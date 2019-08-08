export class Program {
  id?: number | "NEW" = "NEW";
  programName: string;
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  state: string;
  country: string="HM";
  active: 0 | 1 = 1;

}
const newProgram = new Program();

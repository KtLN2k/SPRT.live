import {splitTeamAgeLabel} from "@/lib/football/names";

export function TeamName({value,className=""}:{value:string;className?:string}){
 const {primary,age}=splitTeamAgeLabel(value);
 return <span className={`localized-team-name ${className}`}><span>{primary}</span>{age&&<small>{age}</small>}</span>;
}

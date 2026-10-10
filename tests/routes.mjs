export const ENTRY=['begin','door','enter','quiet'];
export const QUICK=[...ENTRY,'workshop','search','cutters','back','spare','back','tag','back','power','=312','ellis','return','back','stage'];
export const RECORDS=[...ENTRY,'register','back','dining','look','plan','back','ribbon','back','back','office','search','tape','take','safe','=2710','keep','ignore','workshop','search','cutters','back','spare','back','tag','back','power','=312','ellis','return','archive','key','open','certificate','copy','statement','keep','register','keep','passage','meet','help'];
export const ROUTES={
 daylight:[...RECORDS,'escape','cut','complete'],
 witness:[...QUICK,'passage','meet','help','escape','cut','testify'],
 stay:[...RECORDS,'send','send'],
 silence:[...ENTRY,'dining','look','plan','back','back','workshop','search','spare','back','power','=312','ellis','return','back','stage','envelope','accept'],
 ashes:[...QUICK,'passage','meet','help','burn','burn'],
 guest:[...QUICK,'passage','meet','help','escape','pull','last'],
 walk:['leave'],
 floor:[...QUICK,'passage','chain','return','drain','records']
};

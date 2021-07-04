export class Baby {
    // baby public info
    id ='';
    sys_id: any;
    input_id: any;
    birthday:any = new Date();
    place_booking: number = null;
    place_booking_other: string;
    place_birth: any;
    place_birth_other:string;
    gender: number = null;
    gestation: number = null ;
    birth_weight: number = null;
    mother_name: any;
    mother_age: null;
    mother_prev_pregnancy: number = null;
    mother_other_lives: number = null ;
    expect_delivery: any = new Date();
    presentation: number = null;
    delivery:number = null;
    delay_cord_clamping: boolean =null ;
    minutes_delayed_clamping:number = null;
    skin_to_skin: boolean=null;
    breast_feeding:boolean=null;
    cpapn_given:boolean=null;
    minutes_skin_to_skin: number = null;
    antibiotics: boolean=null;
    steroids: boolean=null;
    problems: Array<number> = [];
    problem_other: any;
    type: any;
    all_episodes: any = [];

    multiple_birth:any;
    multiple_count:any

}

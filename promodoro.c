#include<stdio.h>
#include<windows.h>

int pomodoro();
int rest();
int beep();
int main(){
    int h1,m1,s1;
    int m2;
    printf("Enter work time: 1h or 25m+ or 25m");
    scanf("%d%d%d", &h1,&m1,&s1);
    if(h1>0){
        m2=15;
    }
    else if (m1>25){
        m2=10;
    }
    else if(m1<=25){
        m2=5;
    }
    pomodoro(h1,m1,s1);
    rest(m2);
    

   
}
 
int pomodoro(int h, int m, int s){
    // int h,m,s;
    int d=1000; //1000 millisecond delay
    // printf("Set duration: ");
    // scanf("%d%d%d", &h,&m,&s);
    if(h>24 || m>60 || s>60){
        printf("ERROR ! \n");
        exit(0);
    }    
     
    while(1){
        s--;
        if(s<00){
            s=59;
            m--;
        }
        if(m<00){
            m=59;
            h--;
                
        }
        if(h<00){
           break;
        }
        printf("\n Clock: ");
        printf("\n %02d:%02d:%02d", h,m,s);
        Sleep(d);
        system("cls");
    }
    beep(4400,500);
    Sleep(d);
    beep(4400,500);
}
int rest(int m){
    int s=0;
    int d=1000;
    while(1){
        s--;
        if(s<00){
            s=59;
            m--;
        }
        if(m<00){
            break;
        }
        printf("\n Rest: ");
        printf("\n %02d:%02d", m,s);
        Sleep(d);
        system("cls");
    }
    beep(4400,500);
    Sleep(d);
    beep(4400,500);
}
int beep(int x, int y){
    Beep(x,y); // Beep(x,y). x is frequency and y is duration
}

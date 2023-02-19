#include<bits/stdc++.h>
#define rep(I,a,b) for(int I=(a);I<=(b);I++)
#define dwn(I,a,b) for(int I=(a);I>=(b);I--)
#define ll long long
#define ERR 1e-6
using namespace std;
string s;
double od[200005];
int sz;
string DICT="_AIUEONX";
int seed=114514; 
int ans[40005];int as;
int cnt[10];
int bq[8][15]={{0},{2,5,6},{1,9},{1,10},{1,7},{1,11},{4,1,2,3,4},{4,1,2,3,4}};
int eyes[25]={9,-1,2,3,4,5,6,7,11,12};
int fnans[40005],fn;
inline void myAssert(bool x){
	if(!x){
		cout<<endl<<"ERROR"<<endl;
		exit(0);
	}
}
inline int randint(int up){
	return (rand()*rand())%up+1;
}
int main(){
	srand(seed);
	ios::sync_with_stdio(0);
	freopen("rina_pipo.txt","r",stdin); 
	while(cin>>s){
		if(s[0]-'0'>=0&&s[0]-'0'<=9){
			double f=stod(s);
			od[++sz]=f;
		}
	}
	for(int i=1;i<=sz;i+=8){
		if(od[i]<=0.01){
			ans[++as]=7;
			continue;
		}
		int id=i+1;
		double sum=od[i+1]; 
		for(int num=i+2;num<=min(i+7,sz);num++){
			if(od[num]>=od[id]) id=num;
			sum+=od[num];
		}
		assert(sum-1<=ERR);
		ans[++as]=id-i;
	}
	//60fps to 10fps
	freopen("rina_pipo_exp_list.txt","w",stdout);
	int skp=6;
	cout<<as<<endl;
	for(int i=1;i<=as;i+=skp){
		memset(cnt,0,sizeof(cnt));
		for(int num=i;num<=min(i+skp-1,as);num++){
			++cnt[ans[num]];
		}
		int id=0;
		for(int num=1;num<=7;num++) if(cnt[num]>=cnt[id]) id=num;
		fnans[++fn]=id;
		//assert(id>=1&&id<=7);
		cout<<DICT[id];
	}
	cout<<endl;
	freopen("rina_pipo_exp.txt","w",stdout);
	for(int i=1;i<=fn;i++){
		if(fnans[i]==fnans[i-1]) continue;
		if(fnans[i]==7){
			bool flag=1;
			for(int j=i;j<=min(i+8,fn);j++){
				if(fnans[j]!=7){
					flag=0;
					break;
				}
			}
			if(!flag) continue; 
		}
		int frameid=i*skp/6;
		frameid-=4;frameid=max(frameid,0);
		int sizex=bq[fnans[i]][0];
		int mouth=bq[fnans[i]][randint(sizex)];
		int eyex=eyes[1];
		cout<<frameid<<'!'<<eyex<<','<<eyex<<','<<mouth<<",-1"<<endl;
	}
	return 0;
}


* motivation of BRNN
	* [[Recurrent Neural Network]] 의 단점은 이전에 나온 정보만을 활용해 이후의 출력값을 결정한다는 점이다.
		* ![image-20201101220414462](https://i.loli.net/2020/11/01/KVtxvr9NcniFMS1.png)
	* 이를 보완하기 위해 Bi-directional RNN([[BRNN]]) 을 고안했다.
* 정의
	* [[BRNN]] 은 이전 시간의 정보뿐만 아니라, 특정 시간 이후의 정보들도 활용하여 예측 및 학습을 수행하는 RNN 구조다.
		* [[BRNN]] 은 위의 그림처럼 Acyclic graph 형태를 띄고있다.
	* [[BRNN]] 구조를 구성하는 RNN block 은 [[Long Short-Term Memory]] 또는 [[Gated Recurrent Unit]] 를 활용할 수 있다 (LSTM 이 자주 사용됨).
* Example of BRNN
	* ![image-20201101220534150](https://i.loli.net/2020/11/01/SsCwRzvjUIlKDXF.png)
		* $x^{<3>}$ 에 대하여 예측 $\hat{y}^{<3>}$ 을 수행하고자 한다면, $t=1,2,3$ 에 있는 cell state $a$ 를 가져오고, 뒤로는 $t=3,4$ 에 있는 cell state $a$ 를 가져와서 하나의 vector 를 구성한다.
* [[BRNN]] 계산식
	* ![image-20201101220946072](https://i.loli.net/2020/11/01/TIbuQMOS3KtZLRy.png)
* BRNN 의 단점
	* 학습 및 예측을 위해서 전체 입력을 활용해야 한다.
		* 음성 인식의 경우, 인식을 위해서 화자가 말을 마칠때까지 기다려야 한다.
		* 하지만 자연어 처리의 경우 이미 완벽한 문장이 주어지기 때문에 효율적이다.
	* 전체 입력을 활용하여 예측을 수행하므로 vanilla [[Recurrent Neural Network]] 보다 계산량이 높다.

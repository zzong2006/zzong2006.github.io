* Related
	* [[Poisson distribution]]
	* [[exponential distribution]]
	* [[Gamma distribution]]
	* [site: probabilitycourse](https://www.probabilitycourse.com/chapter11/11_1_2_basic_concepts_of_the_poisson_process.php)
* 소개
	* Poisson process 라고도 불리며, counting process 중 하나이다.
	* 발생 비율 (rate) $\lambda$ 를 가진 어떠한 이벤트가 특정 구간 내에서 발생할 횟수를 세는데 주로 사용된다.
* 정의
	* $\{N(t),t\in[0,\infty)\}$ 에서 rates $\lambda$ 에 해당하는 Possion process 는 다음과 같은 조건을 지닌다.
		* $N(0)=0$
		* $N(t)$ 는 independent 및 stationary increments 하다.
		* 길이 $\tau>0$ 를 가진 어떤 구간내 arrivals 횟수는 $\operatorname{Poisson}(\lambda\tau)$ 분포를 따른다.
			* arrivals: 이벤트가 발생하는 것
	* 디테일한 정의
		* arrival 횟수에 따른 possion process 를 $\Delta$ 에 따라 정리하면 다음과 같다
: $\begin{aligned}&P(N(\Delta)=0)=1-\lambda\Delta+o(\Delta)\\&P(N(\Delta)=1)=\lambda\Delta+o(\Delta)\\&P(N(\Delta)\geq2)=o(\Delta)\end{aligned}$

		* 정의 유도 과정
			* 구간 $\tau$ 를 길이가 $\Delta$ 인 굉장히 짧은 interval 로 만들어보자.
			* 이제 해당 구간 $\Delta$ 내에서 arrivals 의 수가 $0$ 일때의 확률은 다음과 같다
: $\begin{aligned}P(N(\Delta)=0)&=e^{-\lambda\Delta}\\&=1-\lambda\Delta+\frac{\lambda^{2}}{2}\Delta^{2}-\cdots\text{(TaylorSeries)}\end{aligned}$

			* [테일러 급수]([[Taylor Approximation]]) 에서 2 차 이상은 $\Delta$ 가 0 에 가까워질수록 의미없어진다 (negligible).
			* arrival 수가 $1$ 인 경우도 비슷하게 정리하면 다음과 같다
: $\begin{aligned}P(N(\Delta)=1)&=e^{-\lambda\Delta}\lambda\Delta\\&=\lambda\Delta\left(1-\lambda\Delta+\frac{\lambda^{2}}{2}\Delta^{2}-\cdots\right)\quad\text{(TaylorSeries)}\\&=\lambda\Delta+\left(-\lambda^{2}\Delta^{2}+\frac{\lambda^{3}}{2}\Delta^{3}\cdots\right)\\&=\lambda\Delta+o(\Delta)\end{aligned}$

				* $o(\Delta)$ 는 의미없어진 함수
	* Nonhomogeneous
		* stationary increments 특성을 지니지 않은 Poisson process
* 특성
	* stationary increments
		* 정의를 통해 arrivals 의 횟수는 오직 구간의 길이에 의존한다는 것을 알 수 있다.
		* 이를 Possion process 가 stationary increments 를 따른다라고 생각할 수 있다.
	* events must be without any aftereffects
		* 발생하는 일련의 이벤트는 상관관계가 없이 서로 독립적이여야 한다.
* 예시
	* 잡화점에 손님이 도착할 횟수에 대해 Possion process 를 이용하여 모델링하시오. 단, 시간당 도착할 손님의 intensity 는 $\lambda=10$ 이다.
		* 두 손님이 10:00 와 10:20 사이에 도착할 확률을 계산하시오.
			* 1 시간의 1/3 이므로, $\tau=\frac{1}{3}$ 이다. 그리고 정의에 의해 해당 구간에 arrivals 의 횟수 $X$ 는 $X\sim\operatorname{Poisson}(10/3)$ 를 따른다.
			* 즉, $\displaystyleP(X=2)=\frac{e^{-\frac{10}{3}}\left(\frac{10}{3}\right)^{2}}{2!}\approx0.2$
		* 세 손님이 10:00 와 10:20 사이에 도착하면서 그리고 10:20 과 11:00 사이에 일곱 손님이 도착할 확률을 계산하시오.
			* 두 구간이 겹치지 않으므로, independent increments 성질에 의해 다음과 같이 계산할 수 있다
: $P\left(3\text{arrivalsin}I_{1}\text{and}7\text{arrivalsin}I_{2}\right)=P\left(3\text{arrivalsin}I_{1}\right)\cdotP\left(7\text{arrivalsin}I_{2}\right)$

				* $I_{1}$ 는 `(10:00, 10:20]`, 그리고 $I_{2}$ 는 `(10:20, 11:00]` 이다.
			* 각 구간에 대해 $\tau_{1}=1/3$ 그리고 $\tau_{2}=2/3$ 이므로, 확률은 다음과 같다
: $\displaystyleP\left(3\text{arrivalsin}I_{1}\text{and}7\text{arrivalsin}I_{2}\right)=\frac{e^{-\frac{10}{3}}\left(\frac{10}{3}\right)^{3}}{3!}\cdot\frac{e^{-\frac{20}{3}}\left(\frac{20}{3}\right)^{7}}{7!}$

			* 정답은 $\approx0.0325$
* Interarrival and Arrival times
	* Interarrival times
		* $N(t)$ 이 $\lambda$ 인 Poisson process 를 따른다면, interarrival times $X_{1},X_{2},\cdots$ 은 independent 하고 [[exponential distribution]] 을 따른다
: $X_{i}\sim\operatorname{Exponential}(\lambda)$

		* $X_i$ 는 $i$ 번째 arrival 과 $i-1$ 번째 arrival 이 발생한 시구간
	* ![Poisson-interarrival](https://www.probabilitycourse.com/images/chapter11/Poisson-interarrival.png)
* arrival times
	* $N(t)$ 이 $\lambda$ 인 Poisson process 를 따른다면, 각 arrival times $T_{1},T_{2},\cdotsT_{n}$ 은 [[Gamma distribution]] 을 따른다: $\operatorname{Gamma}(n,\lambda)$
		* $\begin{aligned}&T_{1}=X_{1}\\&T_{2}=X_{1}+X_{2}\\&T_{3}=X_{1}+X_{2}+X_{3}
\end{aligned}$ … 이고,
$T_{n}=X_{1}+X_{2}+\cdots+X_{n}$ 의 $X_{i}\sim\operatorname{Exponential}(\lambda)$ 가 독립일 때 $T_{n}\sim\operatorname{Gamma}(n,\lambda)$ 를 만족한다.

* 즉, 각 $n=1,2,3,\cdots$ 에 대해, $E\left[T_{n}\right]=\frac{n}{\lambda},\text{and}\operatorname{Var}\left(T_{n}\right)=\frac{n}{\lambda^{2}}$

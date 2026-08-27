* Versioning
	* `FLAGS.model_version` specifies the **version** of the model.
	* You should specify a larger integer value when exporting a newer version of the same model.
	* Each version will be exported to a different sub-directory under the given path.
* Model Server Configuration
	* There are two ways to reload the Model Server configuration
		* 주기적으로 확인: By setting the `--model_config_file_poll_wait_seconds` flag to instruct the server to periodically check for a new config file at `--model_config_file` filepath.
		* 준비되면 서버 부르기: By issuing [HandleReloadConfigRequest](https://github.com/tensorflow/serving/blob/master/tensorflow_serving/apis/model_service.proto#L22) RPC calls to the server and supplying a new Model Server config programmatically.
* Model Server Config Details

```plain text
model_version_policy {
  specific {
    versions: 42
    versions: 43
  }
}
version_labels {
  key: 'stable'
  value: 42
}
version_labels {
  key: 'canary'
  value: 43
}
```

* Please note that labels can only be assigned to model versions that are **already** loaded and available for serving.
* server core
	* 새로운 데이터 셋에서 학습을 하거나 새로운 알고리즘을 통해서 모델 버전 v1 하고 v2 가 runtime 에서 계속 (dynamically) 생성된다고 생각해보자.
	* 위 상황에서 TensorFlow Serving 에서는 v1 를 serving 하면서 v2 는 적재하고 모니터링하면서 gradual rollout 할수도 있고, 아니면 아예 v2 를 적재하기 전에 v1 를 버릴 수 있다.
	* 전자는 transition 상황에서 availability 를 유지하기 좋고, 후자는 자원 사용량 (RAM) 을 최소화할 수 있어서 좋다.
	* TensorFlow Serving 의 `Manager` 가 상기의 일을 한다.
		* It handles the full lifecycle of TensorFlow models including loading, serving and unloading them as well as version transitions.
		* Whenever a new version is available, this `AspiredVersionsManager` loads the new version, and under its default behavior unloads the old one.

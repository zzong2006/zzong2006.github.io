---
title: "ViewFS"
tags: ["hadoop"]
---

# A) Viewfs 란?

ViewFS 는 여러 하둡 파일 시스템에 속하는 네임스페이스를 관리하는 방법을 제공한다. 특히 클러스터가 여러개의 네임노드들을 가지고 있다면 당연히 여러 네임스페이스를 가지고 있는데, 이런 경우 유용하다.

# B) ViewFS 사용법

말 그대로 view 역할을 해준다.

우선 아래처럼 view 역할을 하는 defaultFS 를 설정한다.

```xml
<property>
  <name>fs.defaultFS</name>
  <value>viewfs://clusterX</value>
</property>
```

그리고 접근하는 path 에 따라 어떻게 접근할지 세분화한다. fallback 을 설정하면 구체적으로 설정되지 않은 path 에 대해서도 대응이 가능하다.

```xml
<configuration>
  <property>
    <name>fs.viewfs.mounttable.ClusterX.link./data</name>
    <value>hdfs://nn1-clusterx.example.com:8020/data</value>
  </property>
  <property>
    <name>fs.viewfs.mounttable.ClusterX.link./project</name>
    <value>hdfs://nn2-clusterx.example.com:8020/project</value>
  </property>
  <property>
    <name>fs.viewfs.mounttable.ClusterX.linkFallback</name>
    <value>hdfs://nn5-clusterx.example.com:8020/home</value>
  </property>
</configuration>
```

위 예시에서 사용자가 namespace `/data` 에 접근하면 `hdfs:// … /data` 에 접근하지만, `log` 처럼 설정하지 않은 네임스페이스에 대해서는 `hdfs:// … /home` 에 접근하게 된다.


# C) References

* [Apache Hadoop 3.3.4 – ViewFs Guide](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/ViewFs.html)

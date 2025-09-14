import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Progress,
  Descriptions,
  Table,
  Button,
  Space,
  message,
  Tag,
  Divider
} from "antd";
import {
  ReloadOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  HddOutlined,
  CoffeeOutlined
} from "@ant-design/icons";
import styles from "./index.module.scss";

interface CacheData {
  cpu: {
    coreCount: number;
    userUsage: number;
    systemUsage: number;
    idleUsage: number;
  };
  memory: {
    total: number;
    used: number;
    available: number;
    usageRate: number;
  };
  server: {
    serverName: string;
    serverIp: string;
    osName: string;
    osArch: string;
  };
  jvm: {
    javaName: string;
    javaVersion: string;
    startTime: string;
    runTime: string;
    installPath: string;
    inputArgs: string;
  };
  disk: {
    path: string;
    fileSystem: string;
    total: number;
    free: number;
    used: number;
    usageRate: number;
  }[];
}

const Cache = () => {
  const [cacheData, setCacheData] = useState<CacheData | null>(null);
  const [loading, setLoading] = useState(false);

  // 模拟数据
  const mockCacheData: CacheData = {
    cpu: {
      coreCount: 2,
      userUsage: 2,
      systemUsage: 0,
      idleUsage: 97
    },
    memory: {
      total: 7.31,
      used: 3.09,
      available: 4.22,
      usageRate: 42.24
    },
    server: {
      serverName: "i2wv2fqqrmq53mf3nq0ff2",
      serverIp: "172.23.12.68",
      osName: "Linux",
      osArch: "amd64"
    },
    jvm: {
      javaName: "Java HotSpot(TM) 64-Bit Server VM",
      javaVersion: "1.8.0_111",
      startTime: "2025-05-26 10:25:54",
      runTime: "11天5小时19分钟",
      installPath: "/usr/java/jdk1.8.0_111/jre",
      inputArgs: "-Dname=ruoyiproject/ruoyi-vue -Djava.util.timezone=Asia/Shanghai -Xms512m -Xmx1024m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps -XX:NewRatio=1 -XX:SurvivorRatio=30 -XX:+UseParallelGC -XX:+UseParallelOldGC"
    },
    disk: [
      {
        path: "/",
        fileSystem: "ext4",
        total: 39.2,
        free: 24.2,
        used: 15.0,
        usageRate: 38.32
      }
    ]
  };

  // 获取缓存数据
  const fetchCacheData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCacheData(mockCacheData);
      message.success("缓存数据刷新成功！");
    } catch (error) {
      console.error("获取缓存数据失败:", error);
      message.error("获取缓存数据失败！");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCacheData();
  }, []);

  // 磁盘表格列
  const diskColumns = [
    {
      title: "盘符路径",
      dataIndex: "path",
      key: "path",
    },
    {
      title: "文件系统",
      dataIndex: "fileSystem",
      key: "fileSystem",
    },
    {
      title: "盘符类型",
      dataIndex: "fileSystem",
      key: "type",
    },
    {
      title: "总大小",
      dataIndex: "total",
      key: "total",
      render: (value: number) => `${value} GB`
    },
    {
      title: "可用大小",
      dataIndex: "free",
      key: "free",
      render: (value: number) => `${value} GB`
    },
    {
      title: "已用大小",
      dataIndex: "used",
      key: "used",
      render: (value: number) => `${value} GB`
    },
    {
      title: "已用百分比",
      dataIndex: "usageRate",
      key: "usageRate",
      render: (value: number) => (
        <Progress 
          percent={value} 
          size="small" 
          status={value > 80 ? "exception" : "normal"}
        />
      )
    }
  ];

  const formatBytes = (gb: number) => `${gb.toFixed(2)} GB`;

  return (
    <div className={styles.cacheContainer}>
      <div className={styles.header}>
        <h2>服务器监控</h2>
        <Space>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={fetchCacheData}
            loading={loading}
          >
            刷新数据
          </Button>
        </Space>
      </div>

      {cacheData && (
        <div className={styles.content}>
          <Row gutter={[16, 16]}>
            {/* CPU 信息 */}
            <Col span={12}>
              <Card 
                title={<><DesktopOutlined /> CPU</>} 
                className={styles.infoCard}
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="核心数">{cacheData.cpu.coreCount}</Descriptions.Item>
                  <Descriptions.Item label="用户使用率">
                    <Progress percent={cacheData.cpu.userUsage} size="small" />
                  </Descriptions.Item>
                  <Descriptions.Item label="系统使用率">
                    <Progress percent={cacheData.cpu.systemUsage} size="small" />
                  </Descriptions.Item>
                  <Descriptions.Item label="当前空闲率">
                    <Progress 
                      percent={cacheData.cpu.idleUsage} 
                      size="small"
                      strokeColor="#52c41a"
                    />
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            {/* 内存信息 */}
            <Col span={12}>
              <Card 
                title={<><DatabaseOutlined /> 内存</>} 
                className={styles.infoCard}
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="总内存">
                    {formatBytes(cacheData.memory.total)}
                  </Descriptions.Item>
                  <Descriptions.Item label="已用内存">
                    {formatBytes(cacheData.memory.used)}
                  </Descriptions.Item>
                  <Descriptions.Item label="剩余内存">
                    {formatBytes(cacheData.memory.available)}
                  </Descriptions.Item>
                  <Descriptions.Item label="使用率">
                    <Progress 
                      percent={cacheData.memory.usageRate} 
                      size="small"
                      status={cacheData.memory.usageRate > 80 ? "exception" : "normal"}
                    />
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            {/* 服务器信息 */}
            <Col span={24}>
              <Card 
                title={<><DesktopOutlined /> 服务器信息</>} 
                className={styles.infoCard}
              >
                <Row gutter={[32, 16]}>
                  <Col span={12}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="服务器名称">
                        {cacheData.server.serverName}
                      </Descriptions.Item>
                      <Descriptions.Item label="服务器IP">
                        <Tag color="blue">{cacheData.server.serverIp}</Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                  <Col span={12}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="操作系统">
                        {cacheData.server.osName}
                      </Descriptions.Item>
                      <Descriptions.Item label="系统架构">
                        {cacheData.server.osArch}
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            {/* Java虚拟机信息 */}
            <Col span={24}>
              <Card 
                title={<><CoffeeOutlined /> Java虚拟机信息</>} 
                className={styles.infoCard}
              >
                <Row gutter={[32, 16]}>
                  <Col span={12}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Java名称">
                        {cacheData.jvm.javaName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Java版本">
                        <Tag color="green">{cacheData.jvm.javaVersion}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="启动时间">
                        {cacheData.jvm.startTime}
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                  <Col span={12}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="运行时长">
                        <Tag color="orange">{cacheData.jvm.runTime}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="安装路径">
                        {cacheData.jvm.installPath}
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
                <Divider />
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="运行参数">
                    <div className={styles.jvmArgs}>
                      {cacheData.jvm.inputArgs}
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            {/* 磁盘状态 */}
            <Col span={24}>
              <Card 
                title={<><HddOutlined /> 磁盘状态</>} 
                className={styles.infoCard}
              >
                <Table
                  columns={diskColumns}
                  dataSource={cacheData.disk}
                  rowKey="path"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default Cache;

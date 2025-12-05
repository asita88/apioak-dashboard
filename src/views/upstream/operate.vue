<template>
  <div class="main">
    <a-form
      :model="data.formData"
      class="form"
      v-bind="{ labelCol: { xs: { span: 4 } }, wrapperCol: { xs: { span: 18 } } }"
      @finish="fn.onSubmit"
    >
      <a-form-item label="上游名称：" name="name" :rules="schemaUpstream.name">
        <a-input v-model:value="data.formData.name" />
      </a-form-item>

      <a-form-item label="负载均衡：" name="load_balance" :rules="schemaUpstream.load_balance">
        <a-select
          class="select"
          ref="select"
          v-model:value="data.formData.load_balance"
          placeholder="请选择"
        >
          <a-select-option value="1">加权轮询（Round Robin）</a-select-option>
          <a-select-option value="2">一致性哈希（CHash）</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        class="upstream_nodes_main"
        label="上游节点："
        name="upstream_nodes"
        :rules="schemaUpstream.upstream_nodes"
      >
        <a-space
          v-for="(item, index) in data.formData.upstream_nodes"
          :key="item.id"
          style="display: flex; margin-bottom: 0px"
          align="baseline"
        >
          <a-form-item
            class="upstream_nodes_item"
            :name="['upstream_nodes', index, 'node_ip']"
            :rules="schemaUpstream.node_ip"
          >
            <a-input
              placeholder="IPV4"
              v-model:value="data.formData.upstream_nodes[index].node_ip"
            />
          </a-form-item>

          <a-form-item
            class="upstream_nodes_item"
            :name="['upstream_nodes', index, 'node_port']"
            :rules="schemaUpstream.node_port"
          >
            <a-input-number
              placeholder="Port"
              v-model:value="data.formData.upstream_nodes[index].node_port"
            />
          </a-form-item>

          <a-form-item
            class="upstream_nodes_item"
            :name="['upstream_nodes', index, 'node_weight']"
            :rules="schemaUpstream.node_weight"
          >
            <a-input-number
              placeholder="Weight"
              v-model:value="data.formData.upstream_nodes[index].node_weight"
            />
          </a-form-item>

          <a-form-item class="upstream_nodes_item">
            <a @click="fn.addIP()">
              <i class="iconfont icon-tianjia"></i>
            </a>

            <a v-if="index > 0" @click="fn.removeIP(item)">
              <i class="iconfont color-red icon-jian"></i>
            </a>
          </a-form-item>
        </a-space>
      </a-form-item>

      <a-divider orientation="left">健康检测</a-divider>

      <a-form-item label="健康检测：" style="margin-bottom: 16px">
        <a-switch v-model:checked="data.formData.checkEnabled" @change="fn.onCheckEnabledChange" />
      </a-form-item>

      <div v-if="data.formData.checkEnabled">
        <a-form-item 
          label="检测类型：" 
          style="margin-bottom: 16px"
        >
          <a-radio-group v-model:value="data.formData.checkTcp">
            <a-radio :value="true">TCP</a-radio>
            <a-radio :value="false">HTTP</a-radio>
          </a-radio-group>
        </a-form-item>

        <div v-if="!data.formData.checkTcp">
          <a-form-item 
            label="HTTP方法：" 
            style="margin-bottom: 16px"
          >
            <a-select
              v-model:value="data.formData.checkMethod"
              placeholder="请选择（可选）"
              allow-clear
              style="width: 100%"
            >
              <a-select-option value="GET">GET</a-select-option>
              <a-select-option value="POST">POST</a-select-option>
              <a-select-option value="HEADER">HEADER</a-select-option>
              <a-select-option value="OPTIONS">OPTIONS</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item 
            label="HTTP Host：" 
            style="margin-bottom: 16px"
          >
            <a-input
              v-model:value="data.formData.checkHost"
              placeholder="HTTP Host头（可选）"
            />
          </a-form-item>

          <a-form-item 
            label="HTTP URI：" 
            style="margin-bottom: 16px"
          >
            <a-input
              v-model:value="data.formData.checkUri"
              placeholder="/"
            />
            <div style="color: #999; font-size: 12px; margin-top: 6px; line-height: 1.5">
              健康检测的HTTP路径，默认为 /
            </div>
          </a-form-item>
        </div>

        <a-form-item 
          label="检测间隔：" 
          style="margin-bottom: 16px"
        >
          <a-input-number
            v-model:value="data.formData.checkInterval"
            :min="0"
            :max="86400"
            placeholder="1"
            style="width: 100%"
          />
          <div style="color: #999; font-size: 12px; margin-top: 6px; line-height: 1.5">
            健康检测间隔时间（秒），0-86400
          </div>
        </a-form-item>

        <a-form-item 
          label="超时时间：" 
          style="margin-bottom: 16px"
        >
          <a-input-number
            v-model:value="data.formData.checkTimeout"
            :min="0"
            :max="86400"
            placeholder="1"
            style="width: 100%"
          />
          <div style="color: #999; font-size: 12px; margin-top: 6px; line-height: 1.5">
            健康检测超时时间（秒），0-86400
          </div>
        </a-form-item>

        <a-divider style="margin: 16px 0" />

        <div v-if="!data.formData.checkTcp">
          <a-form-item 
            label="健康状态码：" 
            style="margin-bottom: 16px"
          >
            <a-select
              v-model:value="data.formData.healthyHttpStatuses"
              mode="tags"
              placeholder="输入状态码后按回车，如：200, 302"
              style="width: 100%"
              :token-separators="[',']"
            >
            </a-select>
            <div style="color: #999; font-size: 12px; margin-top: 6px; line-height: 1.5">
              哪些HTTP状态码表示健康，多个用逗号分隔，默认：200, 302
            </div>
          </a-form-item>

          <a-form-item 
            label="不健康状态码：" 
            style="margin-bottom: 16px"
          >
            <a-select
              v-model:value="data.formData.unhealthyHttpStatuses"
              mode="tags"
              placeholder="输入状态码后按回车，如：429, 404, 500, 502, 503"
              style="width: 100%"
              :token-separators="[',']"
            >
            </a-select>
            <div style="color: #999; font-size: 12px; margin-top: 6px; line-height: 1.5">
              哪些HTTP状态码表示不健康，多个用逗号分隔，默认：429, 404, 500, 501, 502, 503, 504, 505
            </div>
          </a-form-item>
        </div>

        <a-form-item 
          label="健康成功次数：" 
          style="margin-bottom: 16px"
        >
          <a-input-number
            v-model:value="data.formData.healthySuccesses"
            :min="1"
            :max="254"
            placeholder="2"
            style="width: 100%"
          />
          <div style="color: #999; font-size: 12px; margin-top: 6px; line-height: 1.5">
            连续成功多少次才标记为健康，1-254，默认：2
          </div>
        </a-form-item>

        <div v-if="!data.formData.checkTcp">
          <a-form-item 
            label="HTTP失败次数：" 
            style="margin-bottom: 16px"
          >
            <a-input-number
              v-model:value="data.formData.unhealthyHttpFailures"
              :min="1"
              :max="254"
              placeholder="3"
              style="width: 100%"
            />
            <div style="color: #999; font-size: 12px; margin-top: 6px; line-height: 1.5">
              连续HTTP失败多少次才标记为不健康，1-254，默认：3
            </div>
          </a-form-item>
        </div>

        <a-form-item 
          label="TCP失败次数：" 
          style="margin-bottom: 16px"
        >
          <a-input-number
            v-model:value="data.formData.unhealthyTcpFailures"
            :min="1"
            :max="254"
            placeholder="3"
            style="width: 100%"
          />
          <div style="color: #999; font-size: 12px; margin-top: 6px; line-height: 1.5">
            连续TCP失败多少次才标记为不健康，1-254，默认：3
          </div>
        </a-form-item>

        <a-form-item 
          label="超时失败次数：" 
          style="margin-bottom: 16px"
        >
          <a-input-number
            v-model:value="data.formData.unhealthyTimeouts"
            :min="1"
            :max="254"
            placeholder="3"
            style="width: 100%"
          />
          <div style="color: #999; font-size: 12px; margin-top: 6px; line-height: 1.5">
            连续超时多少次才标记为不健康，1-254，默认：3
          </div>
        </a-form-item>
      </div>

      <a-form-item label="连接超时：" name="connect_timeout">
        <a-input v-model:value="data.formData.connect_timeout" placeholder="请输入（毫秒）" />
      </a-form-item>

      <a-form-item label="写超时：" name="write_timeout">
        <a-input v-model:value="data.formData.write_timeout" placeholder="请输入（毫秒）" />
      </a-form-item>

      <a-form-item label="读超时：" name="read_timeout">
        <a-input v-model:value="data.formData.read_timeout" placeholder="请输入（毫秒）" />
      </a-form-item>

      <a-form-item label="启用：" v-show="currentResId == null">
        <a-switch v-model:checked="data.formData.enable" />
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 10, offset: 16 }">
        <a-button type="primary" html-type="submit">保存</a-button>
        <a-button style="margin-left: 15px" @click="fn.cancel">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { $upstreamInfo, $upstreamAdd, $upstreamUpdate } from '@/api'
import { schemaUpstream } from '@/schema'

export default {
  props: {
    currentResId: null
  },
  emits: ['componentCloseDrawer', 'componentRefreshList'],
  setup(props, { emit }) {
    // 初始化——服务详情数据
    onMounted(async () => {
      if (props.currentResId !== null) {
        getInfo(props.currentResId)
      }
    })

    // 默认节点数据
    const defaultNode = {
      id: 0,
      node_ip: null,
      node_port: null,
      node_weight: null
    }

    // 定义变量
    const data = reactive({
      formData: {
        name: null,
        load_balance: null,
        connect_timeout: null,
        write_timeout: null,
        read_timeout: null,
        upstream_nodes: ref([defaultNode]),
        enable: false,
        checkEnabled: false,
        checkTcp: true,
        checkMethod: '',
        checkHost: '',
        checkUri: '/',
        checkInterval: 1,
        checkTimeout: 1,
        healthyHttpStatuses: ['200', '302'],
        healthySuccesses: 2,
        unhealthyHttpStatuses: ['429', '404', '500', '501', '502', '503', '504', '505'],
        unhealthyHttpFailures: 3,
        unhealthyTcpFailures: 3,
        unhealthyTimeouts: 3
      }
    })

    // 获取详情
    const getInfo = async resId => {
      let { code, data: dataInfo, msg } = await $upstreamInfo(resId)

      if (code !== 0) {
        message.error(msg)
        emit('componentCloseDrawer')
        return
      } else {
        data.formData.name = dataInfo.name
        data.formData.load_balance = dataInfo.algorithm.toString()
        data.formData.enable = dataInfo.enable == 1 ? true : false
        data.formData.connect_timeout = dataInfo.connect_timeout
        data.formData.write_timeout = dataInfo.write_timeout
        data.formData.read_timeout = dataInfo.read_timeout

        if (dataInfo.node_list.length > 0) {
          data.formData.upstream_nodes = []

          dataInfo.node_list.forEach((item, index) => {
            let nodesInfo = JSON.parse(JSON.stringify(defaultNode))
            nodesInfo.id = index
            nodesInfo.node_ip = item.node_ip
            nodesInfo.node_port = item.node_port
            nodesInfo.node_weight = item.node_weight
            data.formData.upstream_nodes.push(nodesInfo)
          })

          // 从第一个节点读取健康检测配置（所有节点共享相同的健康检测配置）
          if (dataInfo.node_list.length > 0 && dataInfo.node_list[0].check) {
            const firstCheck = dataInfo.node_list[0].check
            data.formData.checkEnabled = firstCheck.enabled || false
            data.formData.checkTcp = firstCheck.tcp !== undefined ? firstCheck.tcp : true
            data.formData.checkMethod = firstCheck.method || ''
            data.formData.checkHost = firstCheck.host || ''
            data.formData.checkUri = firstCheck.uri || '/'
            data.formData.checkInterval = firstCheck.interval || 1
            data.formData.checkTimeout = firstCheck.timeout || 1
            
            // 读取健康检测状态码和次数配置
            if (firstCheck.healthy_http_statuses && Array.isArray(firstCheck.healthy_http_statuses)) {
              data.formData.healthyHttpStatuses = firstCheck.healthy_http_statuses.map(s => String(s))
            } else {
              data.formData.healthyHttpStatuses = ['200', '302']
            }
            
            data.formData.healthySuccesses = firstCheck.healthy_successes || 2
            
            if (firstCheck.unhealthy_http_statuses && Array.isArray(firstCheck.unhealthy_http_statuses)) {
              data.formData.unhealthyHttpStatuses = firstCheck.unhealthy_http_statuses.map(s => String(s))
            } else {
              data.formData.unhealthyHttpStatuses = ['429', '404', '500', '501', '502', '503', '504', '505']
            }
            
            data.formData.unhealthyHttpFailures = firstCheck.unhealthy_http_failures || 3
            data.formData.unhealthyTcpFailures = firstCheck.unhealthy_tcp_failures || 3
            data.formData.unhealthyTimeouts = firstCheck.unhealthy_timeouts || 3
          }
        }
      }
    }

    // 增加节点元素
    const addIP = () => {
      data.formData.upstream_nodes.push({
        id: data.formData.upstream_nodes.length,
        node_ip: null,
        node_port: null,
        node_weight: null
      })
    }

    // 健康检测开关变化
    const onCheckEnabledChange = () => {
      if (!data.formData.checkEnabled) {
        // 如果关闭健康检测，重置为默认值
        data.formData.checkTcp = true
        data.formData.checkMethod = ''
        data.formData.checkHost = ''
        data.formData.checkUri = '/'
        data.formData.checkInterval = 1
        data.formData.checkTimeout = 1
        data.formData.healthyHttpStatuses = ['200', '302']
        data.formData.healthySuccesses = 2
        data.formData.unhealthyHttpStatuses = ['429', '404', '500', '501', '502', '503', '504', '505']
        data.formData.unhealthyHttpFailures = 3
        data.formData.unhealthyTcpFailures = 3
        data.formData.unhealthyTimeouts = 3
      }
    }

    // 删除域名元素
    const removeIP = async item => {
      let index = data.formData.upstream_nodes.indexOf(item)
      if (index !== -1) {
        data.formData.upstream_nodes.splice(index, 1)
      }
    }

    // 点击提交保存当前数据
    const onSubmit = async () => {
      let formData = JSON.parse(JSON.stringify(data.formData))
      formData.load_balance = parseInt(formData.load_balance)
      formData.connect_timeout = parseInt(formData.connect_timeout)
      formData.write_timeout = parseInt(formData.write_timeout)
      formData.read_timeout = parseInt(formData.read_timeout)
      formData.enable = formData.enable == true ? 1 : 2

      // 处理健康检测配置（应用到所有节点）
      if (formData.upstream_nodes && formData.upstream_nodes.length > 0) {
        let checkConfig
        if (formData.checkEnabled) {
          checkConfig = {
            enabled: true,
            tcp: formData.checkTcp,
            method: formData.checkMethod || '',
            host: formData.checkHost || '',
            uri: formData.checkUri || '/',
            interval: formData.checkInterval || 1,
            timeout: formData.checkTimeout || 1,
            healthy_successes: formData.healthySuccesses || 2,
            unhealthy_http_failures: formData.unhealthyHttpFailures || 3,
            unhealthy_tcp_failures: formData.unhealthyTcpFailures || 3,
            unhealthy_timeouts: formData.unhealthyTimeouts || 3
          }
          
          // 处理HTTP状态码（转换为数字数组）
          if (!formData.checkTcp) {
            if (formData.healthyHttpStatuses && formData.healthyHttpStatuses.length > 0) {
              checkConfig.healthy_http_statuses = formData.healthyHttpStatuses.map(s => parseInt(s)).filter(s => !isNaN(s) && s >= 100 && s <= 599)
            } else {
              checkConfig.healthy_http_statuses = [200, 302]
            }
            
            if (formData.unhealthyHttpStatuses && formData.unhealthyHttpStatuses.length > 0) {
              checkConfig.unhealthy_http_statuses = formData.unhealthyHttpStatuses.map(s => parseInt(s)).filter(s => !isNaN(s) && s >= 100 && s <= 599)
            } else {
              checkConfig.unhealthy_http_statuses = [429, 404, 500, 501, 502, 503, 504, 505]
            }
          }
        } else {
          checkConfig = {
            enabled: false,
            tcp: true,
            method: '',
            host: '',
            uri: '/',
            interval: 1,
            timeout: 1,
            healthy_successes: 2,
            unhealthy_http_failures: 3,
            unhealthy_tcp_failures: 3,
            unhealthy_timeouts: 3
          }
        }

        formData.upstream_nodes = formData.upstream_nodes.map(node => ({
          node_ip: node.node_ip,
          node_port: node.node_port,
          node_weight: node.node_weight,
          check: checkConfig
        }))
      }

      // 调用增加/修改接口
      let res
      if (props.currentResId !== null) {
        res = await $upstreamUpdate(props.currentResId, formData)
      } else {
        res = await $upstreamAdd(formData)
      }

      if (res.code && res.code != 0) {
        message.error(res.msg)
        return
      } else {
        message.success(res.msg)
        emit('componentRefreshList')
      }
    }

    // 表单取消，关闭抽屉
    const cancel = async () => {
      emit('componentCloseDrawer')
    }

    // 定义函数
    const fn = reactive({
      addIP,
      removeIP,
      onSubmit,
      cancel,
      onCheckEnabledChange
    })

    return {
      schemaUpstream,
      data,
      fn
    }
  }
}
</script>

<style lange="scss" scoped>
.main {
  padding: 10px;
}
.form {
  width: '150px';
}
.upstream_nodes_main {
  margin-bottom: 0px;
}
.upstream_nodes_item {
  /* display: inline-block;
  justify-content: center;
  margin-right: 10px; */
}
</style>

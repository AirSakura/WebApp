# -*- coding: utf-8 -*-
# @Time    : 2021-09-20 15:39
# @Author  : 肖泽云
# @Email   : xwebsite@163.com
# @File    : client.py
# @Project: Client
import os
import socket
import time

Ignore_File_Type = "" #忽略的文件类型
buffSize = 4096  #文件传输时每块尺寸
# dockerRestartBool = False #是否需要重启项目的容器

def loadConfig(configfilepath:str):
    """加载配置信息"""
    try:
        with open(configfilepath, 'r') as f:
            list1 = f.readlines()
            for i in range(0, len(list1) - 1):
                tmpLine = list1[i]
                if len(tmpLine) > 0 and "[config]" in tmpLine:
                    # 找到下一个
                    for j in range(i + 1, len(list1)):
                        if len(list1[j]) > 0 and "[config" in list1[j]:
                            j -= 1
                            break
                    tmpKeyValueList = {}
                    for kk in range(i + 1, j + 1):
                        tmpLines = list1[kk].strip().split("=")
                        if len(tmpLines) > 1:
                            tmpKeyValueList[tmpLines[0].strip()] = tmpLines[1].strip()
                    if len(tmpKeyValueList) > 0:
                        return tmpKeyValueList
    finally:
        if f:
            f.close()
    return None


def main():
    tmpPath = os.getcwd() + os.path.sep + "config.ini"
    if not os.path.exists(tmpPath):
        tmpPrintInfo = '[%s] [读取配置] 当前文件夹下不存在config.ini配置文件.' % (time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))
        print(tmpPrintInfo)
        return
    tmpConfigParams = loadConfig(tmpPath)
    if tmpConfigParams is None:
        tmpPrintInfo = '[%s] [读取配置] 配置文件config.ini加载错误.' % (
            time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))
        print(tmpPrintInfo)
        return
    if "name" not in tmpConfigParams:
        tmpPrintInfo = '[%s] [读取配置] 配置文件config.ini中没有name参数.' % (
            time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))
        print(tmpPrintInfo)
        return
    if "key" not in tmpConfigParams:
        tmpPrintInfo = '[%s] [读取配置] 配置文件config.ini中没有key参数.' % (
            time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))
        print(tmpPrintInfo)
        return
    if "serverip" not in tmpConfigParams:
        tmpPrintInfo = '[%s] [读取配置] 配置文件config.ini中没有serverip参数.' % (
            time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))
        print(tmpPrintInfo)
        return
    if "port" not in tmpConfigParams:
        tmpPrintInfo = '[%s] [读取配置] 配置文件config.ini中没有port参数.' % (
            time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))
        print(tmpPrintInfo)
        return
    if "project" not in tmpConfigParams:
        tmpPrintInfo = '[%s] [读取配置] 配置文件config.ini中没有project参数.' % (
            time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))
        print(tmpPrintInfo)
        return

    USERNAME = tmpConfigParams["name"]
    USERKEY = tmpConfigParams["key"]
    ServerIP = tmpConfigParams["serverip"]
    ServerPort = int(tmpConfigParams["port"])
    CURRENTPROJECT = tmpConfigParams["project"]
    dockerRestartBool = False
    if "dockerrestart" in tmpConfigParams and tmpConfigParams["dockerrestart"].lower() == "true":
        dockerRestartBool = True
    tmpPrintInfo = '[%s] [系统通信] 开始连接服务器...' % (time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))
    print(tmpPrintInfo)
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect((ServerIP, ServerPort))
        #第一步发送验证信息
        sock.send(CombineInnerCMDSendData(f"CONNECT|{USERNAME}|{USERKEY}|{CURRENTPROJECT}", None))
        try:
            sock.settimeout(60)  # 设置超时时间
            tmpRecvData = sock.recv(1024)  # 第一次为终端名称
        except:
            tmpRecvData = None
        finally:
            if tmpRecvData is None or len(tmpRecvData) == 0:
                sock.shutdown(2)
                sock.close()
                tmpPrintInfo = '[%s] [系统通信] 连接超时,退出...' % (time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))
                print(tmpPrintInfo)
                return
        tmpDeBool, tmpDeTotalLen, tmpDeHeadLen, tmpHeadStr, tmpDeData = DeCodeRecvData(tmpRecvData)
        if tmpDeBool:
            tmpStrs = tmpHeadStr.split("|")
            if tmpStrs[1] != "1":
                tmpPrintInfo = '[%s] [系统通信] 登录验证失败:%s,退出...' % (time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())), tmpHeadStr[4])
                print(tmpPrintInfo)
                return
            #第二步：获取目录下所有文件
            tmpDataFolder = os.getcwd() +os.path.sep+ "dist"+os.path.sep
            tmpDataFolderLen = len(tmpDataFolder)
            tmpFileList = []
            get_filelistInDir(tmpDataFolder, tmpFileList)
            tmpFileCount = len(tmpFileList)
            if tmpFileCount > 0:
                tmpPrintInfo = '[%s] [数据传输] 共有【%d】个文件需要传输,开始传输...' % (
                time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())), tmpFileCount)
                print(tmpPrintInfo)
                tmpFileTid = 0
                for tmpFileName in tmpFileList:
                    tmpFileTid += 1
                    tmpSendFilePath = tmpFileName[tmpDataFolderLen:].replace(os.path.sep,"\/")
                    tmpMsgTitle = "开始传输文件[%d/%d]:%s" % (tmpFileTid,  tmpFileCount, tmpSendFilePath)
                    tmpPrintInfo = '[%s] [数据传输]    %s...' % (
                        time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())), tmpMsgTitle)
                    print(tmpPrintInfo)
                    #获取文件长度
                    tmpFileSize = os.path.getsize(tmpFileName)
                    #SENDFILE|总数|当前序号|文件相对路径|文件尺寸
                    sock.send(CombineInnerCMDSendData(f"SENDFILE|{tmpFileCount}|{tmpFileTid}|{tmpSendFilePath}|{tmpFileSize}", None))
                    tmpRecvData = sock.recv(1024)
                    tmpDeBool, tmpDeTotalLen, tmpDeHeadLen, tmpHeadStr, tmpDeData = DeCodeRecvData(tmpRecvData)
                    if tmpDeBool:
                        #开始发送文件
                        fp = open(tmpFileName, 'rb')
                        while 1:
                            data = fp.read(buffSize)
                            if not data:
                                #print('{0} file send over...'.format(os.path.basename(filepath)))
                                break
                            sock.send(data)
                        # 关闭当期的套接字对象
                        fp.close()
                #文件传输结束
                if dockerRestartBool:#重启容器
                    sock.send(CombineInnerCMDSendData(f"RESTARTDOCKER|", None))
                    tmpRecvData = sock.recv(1024)
                    tmpDeBool, tmpDeTotalLen, tmpDeHeadLen, tmpHeadStr, tmpDeData = DeCodeRecvData(tmpRecvData)
                    if tmpDeBool:
                        tmpHeadStrs = tmpHeadStr.split("|")
                        if tmpHeadStrs[0] == "RESTARTDOCKERRETURN":  # 结束文件传输
                            if int(tmpHeadStrs[1]):
                                tmpPrintInfo = '[%s] [数据传输]    重启容器返回信息:%s' % (
                                    time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())), tmpHeadStrs[2])
                                print(tmpPrintInfo)
                            else:
                                tmpPrintInfo = '[%s] [数据传输]    重启容器错误,必要时联系管理人员:%s' % (
                                    time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())), tmpHeadStrs[2])
                                print(tmpPrintInfo)
                #最后发送结束指令ENDSENDFILE
                sock.send(CombineInnerCMDSendData(f"ENDSENDFILE|{tmpFileCount}",None))
                #最后等待接收结束
                while 1:
                    tmpRecvData = sock.recv(1024)
                    tmpDeBool, tmpDeTotalLen, tmpDeHeadLen, tmpHeadStr, tmpDeData = DeCodeRecvData(tmpRecvData)
                    if tmpDeBool:
                        tmpHeadStrs = tmpHeadStr.split("|")
                        if tmpHeadStrs[0] == "ENDSENDFILERETURN":#结束文件传输
                            tmpPrintInfo = '[%s] [数据传输]      结束文件传输...' % (
                                time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))
                            print(tmpPrintInfo)
                            break
        sock.shutdown(2)
        time.sleep(5)
        sock.close()
        tmpPrintInfo = '[%s] [系统通信] 退出连接...' % (time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))
        print(tmpPrintInfo)
        return
    except Exception as ex:
        print("连接时错误：", ex)

def DeCodeRecvData(data):
    """解析接收到的数据"""
    tmpTotalLen, tmpHeadLen = 0, 0
    tmpHeadStr, tmpAttachData = None, None
    try:
        # tmpTotalLen = int.from_bytes(data[0:4],byteorder='big',signed=False)
        # tmpHeadLen = int.from_bytes(data[4:8],byteorder='big',signed=False)
        # if tmpHeadLen > 0:
        #     tmpHeadStr = str(data[8:tmpHeadLen+8], "utf-8")
        # if tmpTotalLen - tmpHeadLen - 8 > 0:#暂时不考虑分包情况
        #     tmpAttachData = data[tmpHeadLen+8:]
        #return True,tmpTotalLen, tmpHeadLen,tmpHeadStr, tmpAttachData
        #暂时不考虑头部
        tmpHeadStr = str(data, "utf-8")
        return True, tmpTotalLen, tmpHeadLen, tmpHeadStr, tmpAttachData
    except:
        """"""
    return False,tmpTotalLen, tmpHeadLen,tmpHeadStr, tmpAttachData

def CombineInnerCMDSendData(head, data = None):
    """合并处理内部发送的数据"""
    try:
        # tmpTotalLen, tmpHeadLen = 0, 0
        # tmpHeadBS = None
        # if data is not None and len(data) > 0:
        #     tmpTotalLen += len(data)
        # if len(head) > 0:
        #     tmpHeadBS = bytes(head, encoding='utf-8')
        #     tmpHeadLen = len(tmpHeadBS)
        #     tmpTotalLen += tmpHeadLen
        # tmpTotalLen += 8 #头部两个长度
        # tmpBs = tmpTotalLen.to_bytes(length=4,byteorder='big',signed=False) + tmpHeadLen.to_bytes(length=4,byteorder='big',signed=False)
        # if tmpHeadBS is not None and len(tmpHeadBS) > 0:
        #     tmpBs += tmpHeadBS
        # if data is not None and len(data) > 0:
        #     tmpBs += data
        # return tmpBs
        return bytes(head, encoding='utf-8')
    except:
        """"""
    return None

def get_filelistInDir(dir:str, Filelist):
    """获取文件夹下面的所有文件"""
    newDir = dir
    if os.path.isfile(dir):
        filename,filetype = os.path.splitext(dir)
        if not Ignore_File_Type and filetype.lower() == Ignore_File_Type:
            return
        Filelist.append(dir)
    elif os.path.isdir(dir):
        for s in os.listdir(dir):
            # 如果需要忽略某些文件夹，使用以下代码
            # if s == "xxx":
            # continue
            newDir = os.path.join(dir, s)
            get_filelistInDir(newDir, Filelist)
    return Filelist

if __name__ == "__main__":
    try:
        tmpPrintInfo = '[%s] 开始启动项目文件传输管理客户端程序 Version V1.0 2021092001 ...' % (time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))
        print(tmpPrintInfo)
        tmpFoler = os.getcwd() + "/dist"
        if not os.path.exists(tmpFoler):
            os.mkdir(tmpFoler)
        main()
    except Exception as ex:
        print("连接时错误：", ex)

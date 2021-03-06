import Taro, {
  Component,
  Config,
  useState,
  useEffect,
  useReachBottom,
  useShareAppMessage,
  useRouter,
  useDidShow
} from '@tarojs/taro'
import { View, Image, Block } from '@tarojs/components'

import './index.scss'
import { getCurrentUser, IUserInfo } from '@/services/user'
import UserInfo from '@/components/user-info'
import Empty from '@/components/empty'
import { LOGIN, LOGOUT } from '@/store/constatnts'
import { useDispatch } from '@tarojs/redux'

const ProfileContent = ({ username, refreshCount }) => {
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null)
  const dispatch = useDispatch()

  const getUser = () => {
    getCurrentUser().then(data => {
      if (data) {
        setUserInfo(data)
        dispatch({ type: LOGIN, payload: { username: data.login } })
      }
    })
  }
  useEffect(() => {
    if (username) {
      getUser()
    }
  }, [refreshCount])

  useShareAppMessage(res => {
    const title = `[${userInfo!.login}] ${userInfo!.bio}`

    return {
      title,
      path: `/pages/developer/index?name=${userInfo!.login}`
    }
  })

  const handleLogout = () => {
    Taro.showModal({
      content: 'Are you sure?',
      cancelText: 'No',
      cancelColor: '#fb3e3b',
      confirmText: 'Sure',
      confirmColor: '#007afb',

      success(res) {
        if (res.confirm) {
          dispatch({ type: LOGOUT })
          setUserInfo(null)
          Taro.switchTab({ url: '/pages/trending/index' })
        } else if (res.cancel) {
        }
      }
    })
  }

  return (
    <Block>
      {userInfo ? (
        <UserInfo userInfo={userInfo} onLogout={handleLogout}></UserInfo>
      ) : (
        <Empty></Empty>
      )}
    </Block>
  )
}

export default ProfileContent

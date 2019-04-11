import Signin from './components/Signin'
import Signup from './components/Signup'
import UserMenu from './components/UserMenu'
import CaptchaCodeInput from './components/CaptchaCodeInput'
import ForgetPassword from './components/ForgetPassword'
import ResetPassword from './components/ResetPassword'

export default {
  components: {
    'Auth.Signin': Signin,
    'Auth.Signup': Signup,
    'Auth.UserMenu': UserMenu,
    'Auth.ForgetPassword': ForgetPassword,
    'Auth.ResetPassword': ResetPassword
  },
  form_fields: {
    captcha: {
      component: CaptchaCodeInput
    }
  }
}

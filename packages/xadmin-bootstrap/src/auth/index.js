import Signin from './components/SignIn'
import Signup from './components/SignUp'
import UserMenu from './components/UserMenu'
import CaptchaCodeInput from './components/CaptchaCodeInput'
import ChangePassword from './components/ChangePassword'
import ForgetPassword from './components/ForgetPassword'
import ResetPassword from './components/ResetPassword'

export default {
  components: {
    'Auth.Signin': Signin,
    'Auth.Signup': Signup,
    'Auth.UserMenu': UserMenu,
    'Auth.ChangePassword': ChangePassword,
    'Auth.ForgetPassword': ForgetPassword,
    'Auth.ResetPassword': ResetPassword
  },
  form_fields: {
    captcha: {
      component: CaptchaCodeInput
    }
  }
}

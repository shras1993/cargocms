require("../../bootstrap.test.js")
import {login, logout} from "../../util/e2eHelper.js"

describe.only('test user', () => {

  describe('user login',() =>{

    it('user login step start', (done)=>{
      try {
          //login
          browser.url('http://localhost:1338/admin/login');
          browser.setValue('[name="identifier"]', 'admin')
          .setValue('[name="password"]', 'admin')
          .click('[type=submit]');
          done();
        } catch (e) {
          done(e);
        }
      });


    it('create @watch',async (done) => {
      try {
        const userData = {
          username: 'LALA',
          email: 'lalala@mail.com',
          firstName: 'la',
          lastName: 'lala',
          password: '123'
        };
      // 新增
      browser.url('http://localhost:1338/admin/#/admin/user');
      browser.waitForExist('#ToolTables_main-table_1',2000)
      browser.click('#ToolTables_main-table_1');

      const searchInput = browser.element('#content');

      searchInput.waitForExist(1000);

      //填入資料
      searchInput
        .setValue('[name="username"]', userData.username)
        .setValue('[name="email"]', userData.email)
        .setValue('[name="firstName"]', userData.firstName)
        .setValue('[name="lastName"]', userData.lastName)
        .setValue('[name="password"]', userData.password)
        .setValue('[name="passwordConfirm"]', userData.password);

      //送出
      browser
        .click('#main-form footer button[type="submit"]')
        .waitForExist('#main-table-widget', 1000, true);

      //降冪排序
      browser.waitForExist('#main-table-widget tr th:nth-child(1)', 1000);
      browser.click('#main-table-widget tr th:nth-child(1)');

      //檢查
      const usernameField = browser.element('#main-table-widget tbody tr:nth-child(1) td:nth-child(4)').getText();
      const res = await User.find({where: {email: userData.email}});

      //檢查新增後資料庫data是否與前端呈現相符
      expect(res.email).to.be.equal(usernameField);

      done();
    } catch (e) {
      done(e);
    }
  });

    it('Update user infomation', async(done) => {
      try{
        const updateUser = 'LALA';

        const userInfo = {
          username: 'BrooklynBackham',
          email: 'brooklynBay@email.com',
          firstName: 'Brooklyn',
          lastName: 'Backham',
          password: 'chloe'
        }

        //search user item
        browser.waitForExist('#main-table_filter input[type=search]', 1000)
        browser.setValue('#main-table_filter input[type=search]', updateUser);
        browser.click('#main-table tbody').click('#ToolTables_main-table_2');

        //loading edit page
        const updateUserInput = browser.element('#content');
        updateUserInput.waitForExist(1000);

        updateUserInput
          .setValue('[name="username"]', userInfo.username)
          .setValue('[name="email"]', userInfo.email)
          .setValue('[name="firstName"]', userInfo.firstName)
          .setValue('[name="lastName"]', userInfo.lastName);

        //save
        browser
          .click('#main-form footer button[type="submit"]')
          .waitForExist('#main-table-widget', 1000, true);

        //降冪排序
        browser.waitForExist('#main-table-widget tr th:nth-child(1)', 1000);
        browser.click('#main-table-widget tr th:nth-child(1)');

        //check
        const userUpdateField = browser.element('#main-table-widget tbody tr:nth-child(1) td:nth-child(4)').getText();
        const res = await User.find({where: {email: userInfo.email}});

        //檢查更新後資料庫data是否與前端呈現相符
        expect(res.email).to.be.equal(userUpdateField);

        done();
      }catch(e){
        done(e);
      }
    });

    it.skip('user logout', (done) => {

      try{
        //logout
        browser.url('http://localhost:1338/logout?url=/admin/login');
        done();
      }
      catch(e){
        done(e);
      }

    });

  });

});

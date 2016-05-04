'use strict';

let langFile = require(process.argv[2]);
let keyToAdd = process.argv[3];
let valToAdd = process.argv[4];

function constructJson(jsonKey, jsonValue){
   let jsonObj = langFile;
   let jsonKeyArr = jsonKey.split('.');
   let currentValue = jsonObj;

   for(let i = 0; i < jsonKeyArr.length;i++){
       if(currentValue[jsonKeyArr[i]]===undefined){
          currentValue[jsonKeyArr[i]] = {};
       }
       if(i < jsonKeyArr.length-1){
       currentValue =  currentValue[jsonKeyArr[i]];
       }else{
            currentValue[jsonKeyArr[i]] = jsonValue;
       }
   }
   return jsonObj;
}

if (keyToAdd != null) {
    let result = constructJson(keyToAdd, valToAdd)

    let fs = require('fs');

    fs.writeFile(process.argv[2], JSON.stringify(result, null, 2), function(err) {
        if(err) {
            return console.log(err);
        }
    });
} else {
    let path = process.argv[2];

    if (path.indexOf('english.json')) {
        path = path.slice(0, path.length - "english.json".length);
    }

    let fs = require('fs');

    fs.writeFile(path + "/jsonoutput.txt", allInternalObjs(langFile), function(err) {
        if(err) {
            return console.log(err);
        }
    });

    let filelist = [];

    let grabFiles = function(dir, filelist) {
      let fs = require('fs'),
          files = fs.readdirSync(dir);
      filelist = filelist || [];
      files.forEach(function(file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
          filelist = grabFiles(dir + '/' + file, filelist);
        }
        else {
            //if (file.endsWith('.jsx')) {
                filelist.push(dir + '/' + file);
            //}
        }
      });
      return filelist;
    };

    grabFiles('../app', filelist)
    grabFiles('../../embedded', filelist)

    let extKeysFromFiles = [];

    for (let i = 0; i < filelist.length; i++) {
        fs.readFile(filelist[i], 'utf8', function(err, data) {
            if (err) throw err;
            let out = data.match(/localizedString(\(.*\))/g);
            if (out != null) {
                for (let j = 0; j < out.length; j++) {
                    if (out[j].indexOf('errors.') > -1 || out[j].indexOf('member_type') > -1 || out[j].indexOf('.') == -1 || out[j].indexOf('game') > -1 || out[j].indexOf('games') > -1) {
                        continue
                    } else {
                        let str = out[j]

                        //REWRITE!!!

                        str = str.replace('localizedString', '')
                        str = str.replace('}<br/>{', '\n')
                        str = str.replace('this.context.localizedString', '\n')
                        str = str.replace('localizedString', '')
                        str = str.replace(' : ', '\n')
                        str = str.replace(" + this.props.community.get('short_title')", '')
                        str = str.replace('this.props.allowEmail ? ', '')
                        str = str.replace("('pages.communities.member_kickban_dialog.kick') + ' ' + this.props.entry.getIn(['user', 'display_name'])", '')
                        str = str.replace('</span>', '')
                        str = str.replace("('components.member_list.banned_title'))", "('components.member_list.banned_title')")
                        str = str.replace("], ['pending_users',", '')
                        str = str.replace("], ['banned_users', this.context.", '')
                        str = str.replace(" + this.state.selectedEntry.getIn(['user', 'display_name'])", '')
                        str = str.replace(", term, this.renderUser, this.onMoreFriendsClicked, false)", '')
                        str = str.replace(", term, this.renderCommunityChannel, this.onMoreChannelsClicked, false)", '')
                        str = str.replace(", term, this.renderUser, this.onMoreFriendsClicked, false)", '')
                        str = str.replace(", term, this.renderSearchUser, this.onMoreUsersClicked, false)", '')
                        str = str.replace(", term, this.renderSearchCommunity, this.onMoreCommunitiesClicked, true, createCommunity)", '')
                        str = str.replace(" <a href='#' onClick=this.props.onTermsClicked}>{", '')
                        str = str.replace(".trim()", '')
                        str = str.replace(", this._onInviteClicked)", '')
                        str = str.replace(", this._onHideChannelClicked)", '')
                        str = str.replace(", form, ActionTypes.DIRECT_CHANNEL_INVITE_USER_SUCCESS)", '')
                        str = str.replace(".toUpperCase()", '')
                        str = str.replace(", this._onEditNotificationSettingsClicked)", '')
                        str = str.replace("} <a href='#' onClick={this.props.onTermsClicked}>{", '')
                        str = str.replace(", this._onLeaveChannelClicked)", '')
                        str = str.replace(", this._onViewTeamProfileClicked)", '')
                        str = str.replace(", this._onInviteChannelUser)", '')
                        str = str.replace(", this._onEditChannel)", '')
                        str = str.replace(", this._onDeleteChannel)", '')
                        str = str.replace(", 'settings')", '')
                        str = str.replace(", 'leave', this._onLeaveGroupClicked)", '')
                        str = str.replace(", 'invite', this._onInviteChannelUser)", '')
                        str = str.replace(", 'edit', this._onEditChannel)", '')
                        str = str.replace(", 'delete', this._onDeleteChannel)", '')
                        str = str.replace(", form, ActionTypes.TEAM_SAVE_SUCCESS))", '')
                        str = str.replace(" + this.props.community.getIn(['hub', 'short_title'])", '')
                        str = str.replace(", this.handleDeleteClick)", '')
                        str = str.replace(", this.handleLeaveClick)", '')
                        str = str.replace(", null, [friends.size]", '')
                        str = str.replace(", null, [acceptedFriends.size]", '')
                        str = str.replace("} onTouchTap={()", '')
                        str = str.replace(", null, [user.get('display_name')]),", ')')
                        str = str.replace(", form, ActionTypes.GAME_CHANNEL_CREATE_SUCCESS)", '')
                        str = str.replace(" <a href='#' onTouchTap={function() {this.history.pushState(null, '/channel/1e157962-c9b5-4aba-87f9-b16e7497d029', null); }.bind(this)}>GOSU <mark>#</mark>{", '')
                        str = str.replace("</a> {this.context.", '\n')
                        str = str.replace("(NOTIFICATION_SETTINGS[key].display_string)", '')
                        str = str.replace(", form, ActionTypes.PROFILE_UPDATE_SUCCESS)", '')
                        str = str.replace(".toLowerCase()", '')
                        str = str.replace(", form, ActionTypes.ADD_FRIEND_SUCCESS)", '')
                        str = str.replace("}<span className='caption'>{", '')
                        str = str.replace(", form, ActionTypes.TEAM_SAVE_SUCCESS)", '')
                        str = str.replace(", form, ActionTypes.TEAM_JOIN_SUCCESS)", '')
                        str = str.replace(", form, null)", '')
                        str = str.replace("(pref.labelKey)", '')
                        str = str.replace(" + this.props.group.get('name')", '')
                        str = str.replace(" + this.state.selectedItem.get('name')", '')
                        str = str.replace("('pages.preferences.' + props.sectionKey + '.title')", '')
                        str = str.replace("('pages.preferences.channellist.group_sections_header'))", "('pages.preferences.channellist.group_sections_header')")
                        str = str.replace("}<br/>{", '\n')
                        str = str.replace(", null, null, communities)", '')
                        str = str.replace(", this._onAddGameClicked, games)", '')
                        str = str.replace(", this._onAddAccountClicked, accounts)")
                        str = str.replace(", form, ActionTypes.UPDATE_USER_ACCOUNT_SUCCESS)", '')
                        str = str.replace(", form, [ActionTypes.UPDATE_USER_ACCOUNT_SUCCESS, ActionTypes.DELETE_USER_ACCOUNT_SUCCESS])", '')
                        str = str.replace(", form, ActionTypes.UPDATE_GAME_ENTRY_SUCCESS)", '')
                        str = str.replace(", form, [ActionTypes.UPDATE_GAME_ENTRY_SUCCESS, ActionTypes.DELETE_GAME_ENTRY_SUCCESS])", '')
                        str = str.replace("('components.form_multiselect_user.select_user_or_email'", "('components.form_multiselect_user.select_user_or_email')")
                        str = str.replace("'components.form_multiselect_user.select')", "('components.form_multiselect_user.select')")
                        str = str.replace("} {", '')
                        str = str.replace("('components.member_list.pending')('components.member_list.banned')", "('components.member_list.pending')\n('components.member_list.banned')")
                        str = str.replace("('services.user.unknown_server_error'))", "('services.user.unknown_server_error')")
                        str = str.replace("('pages.chat.chat_header.notification_settings'), 'settings'", "('pages.chat.chat_header.notification_settings')")
                        str = str.replace("('pages.chat.chat_header.invite_user_to_channel'), 'invite'", "('pages.chat.chat_header.invite_user_to_channel')")
                        str = str.replace("('pages.chat.chat_header.edit_channel'), 'edit'", "('pages.chat.chat_header.edit_channel')")
                        str = str.replace("('pages.chat.chat_header.delete_channel'), 'delete'", "('pages.chat.chat_header.delete_channel')")
                        str = str.replace("('pages.chat.chat_header.delete'), action)", "('pages.chat.chat_header.delete')")
                        str = str.replace("('pages.chat.chat_header.confirm_action'))", "('pages.chat.chat_header.confirm_action')")
                        str = str.replace("('pages.chat.chat_header.delete_text'))", "('pages.chat.chat_header.delete_text')")
                        str = str.replace("('pages.games.game_channel_create.distinct')})", "('pages.games.game_channel_create.distinct')")
                        str = str.replace("('pages.games.game_channel_create.at_least_one')})", "('pages.games.game_channel_create.at_least_one')")
                        str = str.replace("('pages.games.game_channel_create.only_two')})", "('pages.games.game_channel_create.only_two')")
                        str = str.replace("('pages.games.game_channel_create.max_chars')})", "('pages.games.game_channel_create.max_chars')")
                        str = str.replace("('app.profile_info.edit'))", "('app.profile_info.edit')")
                        str = str.replace("('app.profile.games'),", "('app.profile.games')")
                        str = str.replace("('app.profile.accounts'),", "('app.profile.accounts')")
                        str = str.replace("('app.profile.accounts_add')undefined", "('app.profile.accounts_add')")
                        str = str.replace("{", '')
                        str = str.replace("}", '')

                        str = str.replace("('", '')
                        str = str.replace("')", '')
                        str = str.replace(")", '')
                        str = str.replace("))", '')

                        str = str.replace("components.voice_button.unsupported_text)", "components.voice_button.unsupported_text")

                        if (str.indexOf(", '") == -1) {
                            str = str.replace(" ", '')
                        }

                        //REWRITE!!!

                        if (str.indexOf('\n') != -1) {
                            let extstr = str.slice(str.indexOf('\n'), str.length)
                            str = str.replace(extstr, '')
                            extstr = extstr.replace("{", '')
                            extstr = extstr.replace("}", '')
                            extstr = extstr.replace("('", '')
                            extstr = extstr.replace("')", '')
                            extstr = extstr.replace("this.context.('", '')
                            extstr = extstr.replace("')", '')
                            extstr = extstr.replace("('", '')
                        }

                        //REWRITE!!!!!!!!

                        if (str === '') {
                            continue
                        }

                        if (searchArray(str, extKeysFromFiles) === false ) {
                            if (str.indexOf(',') === -1) {
                                extKeysFromFiles.push(str);
                            } else {
                                let splitarr = str.split(',')
                                splitarr[0] = splitarr[0].replace('\'', '')
                                splitarr[1] = splitarr[1].replace('\'', '')
                                splitarr[1] = splitarr[1].replace(' ', '')
                                extKeysFromFiles.push(splitarr[0] + ";" + splitarr[1]);
                            }
                        }
                    }
                }
            }

            fs.writeFile(path + "/extkeys.txt", extKeysFromFiles, function(err) {
                if(err) {
                    return console.log(err);
                }
            });
        });
    }
}

function searchArray(key, arr) {
   let i;
   i = 0;
   while (i < arr.length) {
     if (arr[i].key === key) {
       return true;
     }
     if (arr[i] === key) {
       return true;
     }
     i++;
   }
   return false;
 }

// get keys of an object or array
function getkeys(z){
  let out=[];
  for(let i in z){out.push(i)};
  return out;
}

// print all inside an object
function allInternalObjs(data, name) {
  name = name || '';

  return getkeys(data).reduce(function(olist, k) {

    let v = data[k];

    if(typeof v === 'object') {
        if (name === '') {
            olist.push.apply(olist, allInternalObjs(v, k));
        } else {
            olist.push.apply(olist, allInternalObjs(v, name + '.' + k));
        }
    }
    else {
        if (name === '') {
            olist.push(k);
        } else {
            olist.push(name + '.' + k);
        }
    }
    return olist;
  }, []);
}

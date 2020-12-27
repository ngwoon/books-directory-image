function getContent() {
    const textArea = document.querySelector(".js-textarea");
    let content = textArea.value;
    content = content.trim();

    return content;
}

function initUpdateRequest() {
    $(".js-update-button").click(function(event) {
        event.preventDefault();

        const content = getContent();

        // 변경사항이 없으면 반응하지 않는다.
        if(content.localeCompare(originalContent) === 0)
            return false;
        else {
            $(".js-update-form").prepend('<input type="hidden" name="_method" value="PUT"/>');

            const url = "/documents/document";
            const type = "post";
            const data = $(".js-update-form").serialize();
            $.ajax({
                url,
                type,
                data,
                success: (data) => {
                    $(".js-update-form input").remove();
                    alert("업데이트 완료");
                },
                error: (req, state, error) => {
                    $(".js-update-form input").remove();
                    alert("업데이트 요청 오류");
                    alert(state + " " + error);
                },
            });
        }
    });  
}

function initDeleteRequest() {
    $(".js-delete-button").click(function(event) {
        event.preventDefault();

        $(".js-update-form").prepend('<input type="hidden" name="_method" value="DELETE"/>');

        const url = "/documents/document";
        const type = "post";
        const data = $(".js-update-form").serialize();
        alert(data);
        $.ajax({
            url,
            type,
            data,
            success: (data) => {
                $(".js-update-form input").remove();
                if(data.state === "success")
                    alert("삭제 요청을 성공적으로 완료되었습니다.");
                else
                    alert("삭제 요청 실패. 서버에 문의하세요.");
            },
            error: (req, state, error) => {
                $(".js-update-form input").remove();
                alert("삭제 요청 오류");
                alert(state + " " + error);
            },
        });
    });
}


function init() {
    const updateBtn = document.querySelector(".js-update-button");
    
    // 편집 가능한 상태. 즉, 로그인된 상태일 때
    if(updateBtn)
        originalContent = getContent();

    initUpdateRequest();
    initDeleteRequest();
}

let originalContent;
init();